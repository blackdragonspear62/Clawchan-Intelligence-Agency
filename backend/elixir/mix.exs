defmodule Clawchan.MixProject do
  use Mix.Project

  def project do
    [
      app: :clawchan,
      version: "2.0.0-alpha",
      elixir: "~> 1.15",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      mod: {Clawchan.Application, []},
      extra_applications: [:logger, :runtime_tools, :os_mon]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      # Web Framework
      {:phoenix, "~> 1.7"},
      {:phoenix_live_view, "~> 0.20"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, "~> 0.17"},
      
      # Real-time Communication
      {:phoenix_pubsub, "~> 2.1"},
      {:absinthe, "~> 1.7"},
      {:absinthe_phoenix, "~> 2.0"},
      {:absinthe_plug, "~> 1.5"},
      
      # WebSocket
      {:cowboy, "~> 2.10"},
      {:cowlib, "~> 2.12"},
      {:gun, "~> 2.0"},
      
      # HTTP Client
      {:finch, "~> 0.16"},
      {:tesla, "~> 1.7"},
      {:hackney, "~> 1.18"},
      
      # Data Processing
      {:flow, "~> 1.2"},
      {:gen_stage, "~> 1.2"},
      {:broadway, "~> 1.0"},
      
      # Caching
      {:cachex, "~> 3.6"},
      {:nebulex, "~> 2.5"},
      
      # Background Jobs
      {:oban, "~> 2.16"},
      
      # Monitoring & Observability
      {:telemetry, "~> 1.2"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:prometheus_ex, "~> 3.0"},
      {:prometheus_plugs, "~> 1.1"},
      
      # Security
      {:bcrypt_elixir, "~> 3.1"},
      {:joken, "~> 2.6"},
      {:jose, "~> 1.11"},
      
      # Validation
      {:ecto_enum, "~> 1.4"},
      {:vex, "~> 0.9"},
      
      # Utilities
      {:jason, "~> 1.4"},
      {:timex, "~> 3.7"},
      {:decimal, "~> 2.1"},
      {:uuid, "~> 1.1"},
      {:nimble_parsec, "~> 1.3"},
      
      # Development & Testing
      {:ex_doc, "~> 0.30", only: :dev, runtime: false},
      {:excoveralls, "~> 0.18", only: :test},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false},
      {:sobelow, "~> 0.13", only: [:dev, :test], runtime: false},
      {:mix_test_watch, "~> 1.1", only: :dev, runtime: false},
      {:ex_unit_notifier, "~> 1.3", only: :test}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.deploy": ["esbuild default --minify", "phx.digest"]
    ]
  end
end
