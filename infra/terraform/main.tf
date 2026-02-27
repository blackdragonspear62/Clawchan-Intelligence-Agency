terraform {
  required_version = ">= 1.6.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.29"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.24"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
  
  backend "s3" {
    bucket         = "clawchan-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "clawchan-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "clawchan"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# VPC and Networking
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.4.0"
  
  name = "clawchan-${var.environment}"
  cidr = var.vpc_cidr
  
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway     = true
  single_nat_gateway     = var.environment != "production"
  enable_dns_hostnames   = true
  enable_dns_support     = true
  enable_ipv6            = true
  
  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }
  
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
  
  tags = {
    Name = "clawchan-${var.environment}"
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.21.0"
  
  cluster_name    = "clawchan-${var.environment}"
  cluster_version = "1.28"
  
  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    general = {
      desired_size = var.node_group_desired_size
      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      
      instance_types = var.node_instance_types
      capacity_type  = var.environment == "production" ? "ON_DEMAND" : "SPOT"
      
      labels = {
        workload = "general"
      }
      
      taints = []
      
      update_config = {
        max_unavailable_percentage = 25
      }
    }
    
    gpu = {
      desired_size = var.gpu_node_desired_size
      min_size     = var.gpu_node_min_size
      max_size     = var.gpu_node_max_size
      
      instance_types = ["g4dn.xlarge", "g4dn.2xlarge"]
      ami_type       = "AL2_x86_64_GPU"
      
      labels = {
        workload = "ml"
        nvidia.com/gpu = "true"
      }
      
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }
  
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }
  
  tags = {
    Name = "clawchan-${var.environment}"
  }
}

# RDS PostgreSQL
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.4.0"
  
  identifier = "clawchan-${var.environment}"
  
  engine               = "postgres"
  engine_version       = "16.1"
  family               = "postgres16"
  major_engine_version = "16"
  instance_class       = var.rds_instance_class
  
  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage
  
  db_name  = "clawchan"
  username = "clawchan_admin"
  port     = 5432
  
  multi_az               = var.environment == "production"
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"
  
  backup_retention_period = var.environment == "production" ? 30 : 7
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  deletion_protection = var.environment == "production"
  
  performance_insights_enabled    = true
  performance_insights_retention_period = 7
  
  tags = {
    Name = "clawchan-${var.environment}"
  }
}

# ElastiCache Redis
module "redis" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "1.2.0"
  
  cluster_id = "clawchan-${var.environment}"
  
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.redis_node_type
  num_cache_nodes      = var.environment == "production" ? 2 : 1
  
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  apply_immediately = var.environment != "production"
  
  tags = {
    Name = "clawchan-${var.environment}"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "assets" {
  bucket = "clawchan-assets-${var.environment}-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name = "clawchan-assets-${var.environment}"
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "clawchan-terraform-state"
  
  lifecycle {
    prevent_destroy = true
  }
  
  tags = {
    Name = "clawchan-terraform-state"
  }
}

# CloudFront CDN
module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "3.4.0"
  
  aliases = ["cdn.clawchan.io", "assets.clawchan.io"]
  
  comment             = "Clawchan CDN ${var.environment}"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  wait_for_deployment = false
  
  origin = {
    s3 = {
      domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "origin-access-identity/cloudfront/XXXXXXXXXXXXXX"
      }
    }
    
    eks = {
      domain_name = module.eks.cluster_endpoint
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }
  
  default_cache_behavior = {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"
    
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
    
    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }
  }
  
  tags = {
    Name = "clawchan-cdn-${var.environment}"
  }
}

# Route53
resource "aws_route53_zone" "main" {
  name = "clawchan.io"
  
  tags = {
    Name = "clawchan.io"
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.clawchan.io"
  type    = "A"
  
  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# Random suffix for unique bucket names
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_instance_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = module.redis.cluster_endpoint
  sensitive   = true
}
