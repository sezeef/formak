#!/bin/bash

# Check if a directory is provided
if [ $# -eq 0 ]; then
    echo "Please provide a directory path"
    exit 1
fi

directory=$1

# Check if the provided path is a directory
if [ ! -d "$directory" ]; then
    echo "The provided path is not a directory"
    exit 1
fi

# Function to get JSON structure (keys only)
get_json_structure() {
    jq -r 'path(..)|[.[]|tostring]|join(".")' "$1" | sort | uniq
}

# Function to compare JSON structures
compare_structures() {
    local file1="$1"
    local file2="$2"
    diff <(get_json_structure "$file1") <(get_json_structure "$file2") | sed -n 's/^< \(.*\)/Only in '"${file1##*/}"': \1/p;s/^> \(.*\)/Only in '"${file2##*/}"': \1/p'
}

# Find all JSON files
mapfile -d $'\0' json_files < <(find "$directory" -type f -name "*.json" -print0)

if [ ${#json_files[@]} -eq 0 ]; then
    echo "No JSON files found in the directory"
    exit 1
fi

echo "Checking JSON files in $directory"

first_file=""
invalid_files=()
mismatched_structure_files=()
error_messages=()

for file in "${json_files[@]}"; do
    echo "Checking $file"
    
    # Check if JSON is valid
    if ! jq empty "$file" 2> .error_output; then
        error=$(cat .error_output)
        echo "  Invalid JSON format"
        echo "  Error: $error"
        invalid_files+=("$file")
        error_messages+=("$file: $error")
        continue
    fi
    
    # If it's the first file, save it as reference
    if [ -z "$first_file" ]; then
        first_file="$file"
        echo "  Valid JSON (Reference file)"
    else
        # Compare current file's structure with the first file
        differences=$(compare_structures "$first_file" "$file")
        if [ -n "$differences" ]; then
            echo "  Structure mismatch"
            mismatched_structure_files+=("$file")
            error_messages+=("$file: Structure mismatch with ${first_file##*/}")
            error_messages+=("$file: Differences:")
            while IFS= read -r line; do
                error_messages+=("  $line")
            done <<< "$differences"
        else
            echo "  Valid JSON and matching structure"
        fi
    fi
done

echo ""
echo "Summary:"
echo "Total JSON files: ${#json_files[@]}"
echo "Invalid JSON format: ${#invalid_files[@]}"
echo "Mismatched structure: ${#mismatched_structure_files[@]}"
echo "Valid and matching structure: $((${#json_files[@]} - ${#invalid_files[@]} - ${#mismatched_structure_files[@]}))"

if [ ${#invalid_files[@]} -gt 0 ]; then
    echo ""
    echo "Files with invalid JSON format:"
    printf '%s\n' "${invalid_files[@]}"
fi

if [ ${#mismatched_structure_files[@]} -gt 0 ]; then
    echo ""
    echo "Files with mismatched structure:"
    printf '%s\n' "${mismatched_structure_files[@]}"
fi

if [ ${#error_messages[@]} -gt 0 ]; then
    echo ""
    echo "Detailed error messages:"
    printf '%s\n' "${error_messages[@]}"
fi
