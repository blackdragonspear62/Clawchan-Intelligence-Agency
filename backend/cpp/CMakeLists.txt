cmake_minimum_required(VERSION 3.25)
project(clawchan_realtime_processor VERSION 2.0.0 LANGUAGES CXX)

# C++23 Standard
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Build options
option(BUILD_TESTS "Build tests" ON)
option(BUILD_BENCHMARKS "Build benchmarks" ON)
option(ENABLE_SANITIZERS "Enable sanitizers" OFF)
option(ENABLE_PROFILING "Enable profiling" OFF)

# Find packages
find_package(Boost 1.83 REQUIRED COMPONENTS system thread filesystem)
find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)

# Conan packages (if available)
find_package(fmt CONFIG QUIET)
find_package(spdlog CONFIG QUIET)
find_package(nlohmann_json CONFIG QUIET)
find_package(redis++ CONFIG QUIET)
find_package(protobuf CONFIG QUIET)
find_package(gRPC CONFIG QUIET)

# External dependencies
include(FetchContent)

# fmt (if not found)
if(NOT fmt_FOUND)
    FetchContent_Declare(
        fmt
        GIT_REPOSITORY https://github.com/fmtlib/fmt.git
        GIT_TAG 10.1.1
    )
    FetchContent_MakeAvailable(fmt)
endif()

# spdlog (if not found)
if(NOT spdlog_FOUND)
    FetchContent_Declare(
        spdlog
        GIT_REPOSITORY https://github.com/gabime/spdlog.git
        GIT_TAG v1.12.0
    )
    FetchContent_MakeAvailable(spdlog)
endif()

# json (if not found)
if(NOT nlohmann_json_FOUND)
    FetchContent_Declare(
        json
        GIT_REPOSITORY https://github.com/nlohmann/json.git
        GIT_TAG v3.11.2
    )
    FetchContent_MakeAvailable(json)
endif()

# Compile options
add_compile_options(
    -Wall
    -Wextra
    -Wpedantic
    -Wshadow
    -Wnon-virtual-dtor
    -Wold-style-cast
    -Wcast-align
    -Wunused
    -Woverloaded-virtual
    -Wconversion
    -Wsign-conversion
    -Wnull-dereference
    -Wdouble-promotion
    -Wformat=2
)

# Release optimizations
if(CMAKE_BUILD_TYPE STREQUAL "Release")
    add_compile_options(
        -O3
        -march=native
        -mtune=native
        -flto
        -ffast-math
    )
    add_link_options(-flto)
endif()

# Debug options
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_compile_options(-O0 -g3)
endif()

# Sanitizers
if(ENABLE_SANITIZERS)
    add_compile_options(-fsanitize=address,undefined)
    add_link_options(-fsanitize=address,undefined)
endif()

# Include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${Boost_INCLUDE_DIRS}
)

# Source files
set(SOURCES
    src/main.cpp
    src/server/tcp_server.cpp
    src/server/websocket_server.cpp
    src/processors/adsb_processor.cpp
    src/processors/satellite_processor.cpp
    src/processors/disaster_processor.cpp
    src/models/aircraft.cpp
    src/models/satellite.cpp
    src/models/disaster.cpp
    src/cache/lru_cache.cpp
    src/cache/redis_client.cpp
    src/utils/logger.cpp
    src/utils/geo_utils.cpp
    src/utils/time_utils.cpp
)

# Header files
set(HEADERS
    include/clawchan/server/tcp_server.hpp
    include/clawchan/server/websocket_server.hpp
    include/clawchan/processors/adsb_processor.hpp
    include/clawchan/processors/satellite_processor.hpp
    include/clawchan/processors/disaster_processor.hpp
    include/clawchan/models/aircraft.hpp
    include/clawchan/models/satellite.hpp
    include/clawchan/models/disaster.hpp
    include/clawchan/cache/lru_cache.hpp
    include/clawchan/cache/redis_client.hpp
    include/clawchan/utils/logger.hpp
    include/clawchan/utils/geo_utils.hpp
    include/clawchan/utils/time_utils.hpp
)

# Main executable
add_executable(clawchan_processor ${SOURCES} ${HEADERS})

target_link_libraries(clawchan_processor
    Boost::system
    Boost::thread
    Boost::filesystem
    Threads::Threads
    OpenSSL::SSL
    OpenSSL::Crypto
    ZLIB::ZLIB
    fmt::fmt
    spdlog::spdlog
    nlohmann_json::nlohmann_json
)

# Set target properties
set_target_properties(clawchan_processor PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)

# Tests
if(BUILD_TESTS)
    enable_testing()
    find_package(GTest QUIET)
    
    if(NOT GTest_FOUND)
        FetchContent_Declare(
            googletest
            GIT_REPOSITORY https://github.com/google/googletest.git
            GIT_TAG v1.14.0
        )
        FetchContent_MakeAvailable(googletest)
    endif()
    
    add_subdirectory(tests)
endif()

# Benchmarks
if(BUILD_BENCHMARKS)
    find_package(benchmark QUIET)
    
    if(NOT benchmark_FOUND)
        FetchContent_Declare(
            benchmark
            GIT_REPOSITORY https://github.com/google/benchmark.git
            GIT_TAG v1.8.3
        )
        FetchContent_MakeAvailable(benchmark)
    endif()
    
    add_subdirectory(benchmarks)
endif()

# Install
install(TARGETS clawchan_processor
    RUNTIME DESTINATION bin
)

install(DIRECTORY include/clawchan
    DESTINATION include
)

# CPack
set(CPACK_PACKAGE_NAME "clawchan-processor")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Clawchan Real-time Data Processor")
set(CPACK_PACKAGE_VENDOR "Clawchan Intelligence Agency")
include(CPack)
