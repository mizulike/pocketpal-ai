#!/bin/bash

# End-to-End Test Runner Script for PocketPal AI
# This script helps run Detox E2E tests with proper setup and error handling

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  ios                    Run iOS E2E tests"
    echo "  android                Run Android E2E tests"
    echo "  both                   Run tests on both platforms"
    echo "  basic-ios              Run basic navigation test on iOS"
    echo "  basic-android          Run basic navigation test on Android"
    echo "  comprehensive-ios      Run comprehensive workflow test on iOS"
    echo "  comprehensive-android  Run comprehensive workflow test on Android"
    echo "  clean                  Clean up test environment"
    echo "  help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 ios                 # Run all iOS tests"
    echo "  $0 basic-android       # Run basic test on Android"
    echo "  $0 both                # Run tests on both platforms"
}

# Main script logic
main() {
    case "${1:-help}" in
        "ios")
            print_status "Running iOS E2E tests..."
            yarn detox:build:ios && yarn detox:test:ios
            ;;
        "android")
            print_status "Running Android E2E tests..."
            yarn detox:build:android && yarn detox:test:android
            ;;
        "both")
            print_status "Running tests on both platforms..."
            yarn detox:build:ios && yarn detox:test:ios
            yarn detox:build:android && yarn detox:test:android
            ;;
        "basic-ios")
            print_status "Running basic navigation test on iOS..."
            yarn detox:build:ios && yarn detox test --configuration ios.sim.debug e2e/basic-navigation.test.js
            ;;
        "basic-android")
            print_status "Running basic navigation test on Android..."
            yarn detox:build:android && yarn detox test --configuration android.emu.debug e2e/basic-navigation.test.js
            ;;
        "comprehensive-ios")
            print_status "Running comprehensive workflow test on iOS..."
            yarn detox:build:ios && yarn detox test --configuration ios.sim.debug e2e/comprehensive-model-workflow.test.js
            ;;
        "comprehensive-android")
            print_status "Running comprehensive workflow test on Android..."
            yarn detox:build:android && yarn detox test --configuration android.emu.debug e2e/comprehensive-model-workflow.test.js
            ;;
        "clean")
            print_status "Cleaning up test environment..."
            pkill -f "react-native start" || true
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"
