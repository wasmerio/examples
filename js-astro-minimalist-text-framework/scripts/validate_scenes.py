#!/usr/bin/env python3
"""
Scene Validator

This script validates all scene files in the data directory to ensure:
1. All scene exits/actions link to valid existing scenes
2. No broken links or missing references exist
"""

import os
import json
import sys
from pathlib import Path
from typing import Dict, Set, List, Any, Tuple

# Configuration
DATA_DIR = Path("src/data")
SPECIAL_KEYWORDS = {"RETURN"}  # Special actions that don't require scene validation

def load_all_scenes() -> Tuple[Dict[str, Any], Dict[str, str]]:
    """Load all scenes from JSON files in the data directory."""
    all_scenes = {}
    scene_file_map = {}  # Maps scene IDs to their source files for better error reporting
    
    for file_path in DATA_DIR.glob("**/*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                scenes = json.load(f)
                
                # Track which file each scene comes from
                for scene_id in scenes:
                    if scene_id in all_scenes:
                        print(f"WARNING: Duplicate scene ID '{scene_id}' found in {file_path.name} "
                              f"(already defined in {scene_file_map[scene_id]})")
                    
                    all_scenes[scene_id] = scenes[scene_id]
                    scene_file_map[scene_id] = file_path.name
                
                print(f"Loaded {len(scenes)} scenes from {file_path.name}")
        except json.JSONDecodeError as e:
            print(f"ERROR: Failed to parse {file_path}: {e}")
            continue
        except Exception as e:
            print(f"ERROR: Failed to process {file_path}: {e}")
            continue
    
    return all_scenes, scene_file_map

def collect_referenced_scenes(all_scenes: Dict[str, Any]) -> Set[str]:
    """Collect all referenced scene IDs from exits and actions."""
    referenced_scenes = set()
    
    for scene_id, scene_data in all_scenes.items():
        # Check direct exits
        exits = scene_data.get("exits", {})
        for action_text, exit_data in exits.items():
            if isinstance(exit_data, str):
                # Simple format: direct scene ID
                if exit_data not in SPECIAL_KEYWORDS:
                    referenced_scenes.add(exit_data)
            elif isinstance(exit_data, dict):
                # Complex format: action with possibly nextScene or results
                if "nextScene" in exit_data and exit_data["nextScene"] not in SPECIAL_KEYWORDS:
                    referenced_scenes.add(exit_data["nextScene"])
                
                # Check results array
                for result in exit_data.get("results", []):
                    if "nextScene" in result and result["nextScene"] not in SPECIAL_KEYWORDS:
                        referenced_scenes.add(result["nextScene"])
                    if "triggerEvent" in result and result["triggerEvent"] not in SPECIAL_KEYWORDS:
                        referenced_scenes.add(result["triggerEvent"])
        
        # Check onEnter effects which might trigger events
        for result in scene_data.get("onEnter", []):
            if "nextScene" in result and result["nextScene"] not in SPECIAL_KEYWORDS:
                referenced_scenes.add(result["nextScene"])
            if "triggerEvent" in result and result["triggerEvent"] not in SPECIAL_KEYWORDS:
                referenced_scenes.add(result["triggerEvent"])
    
    return referenced_scenes

def validate_scenes() -> Tuple[int, List[str]]:
    """Validate all scenes and return error count and list of errors."""
    all_scenes, scene_file_map = load_all_scenes()
    
    if not all_scenes:
        print("ERROR: No scenes found in data directory")
        return 1, ["No scenes found"]
    
    total_words = 0
    
    for scene_id, scene_data in all_scenes.items():
        total_words += len(scene_data["description"])
    
    # Collect all valid scene IDs and all referenced scene IDs
    valid_scene_ids = set(all_scenes.keys())
    referenced_scene_ids = collect_referenced_scenes(all_scenes)
    
    # Find missing scenes (referenced but not defined)
    missing_scenes = referenced_scene_ids - valid_scene_ids
    
    # Find orphaned scenes (defined but not referenced from anywhere)
    orphaned_scenes = valid_scene_ids - referenced_scene_ids
    # The initial scene should not be counted as orphaned
    if "start_alley" in orphaned_scenes:
        orphaned_scenes.remove("start_alley")
    
    # Generate report
    errors = []
    if missing_scenes:
        print("\n=== MISSING SCENES ===")
        print("The following scenes are referenced but don't exist:")
        for scene_id in sorted(missing_scenes):
            # Find where this missing scene is referenced
            references = []
            for source_id, scene_data in all_scenes.items():
                if references_scene(scene_data, scene_id):
                    references.append(f"{source_id} (in {scene_file_map[source_id]})")
            
            ref_str = ", ".join(references[:3])
            if len(references) > 3:
                ref_str += f" and {len(references) - 3} more"
                
            error_msg = f"- {scene_id}: Referenced from {ref_str}"
            print(error_msg)
            errors.append(error_msg)
    
    if orphaned_scenes:
        print("\n=== ORPHANED SCENES ===")
        print("The following scenes exist but are not referenced from anywhere:")
        for scene_id in sorted(orphaned_scenes):
            print(f"- {scene_id} (in {scene_file_map[scene_id]})")
    
    # Summary
    print("\n=== SUMMARY ===")
    print(f"Total scenes: {len(all_scenes)}")
    print(f"Referenced scenes: {len(referenced_scene_ids)}")
    print(f"Missing scenes: {len(missing_scenes)}")
    print(f"Orphaned scenes: {len(orphaned_scenes)}")
    print(f"Total words: {total_words}")
    return len(missing_scenes), errors

def references_scene(scene_data: Dict[str, Any], target_scene_id: str) -> bool:
    """Check if a scene references the target scene ID."""
    # Check direct exits
    exits = scene_data.get("exits", {})
    for _, exit_data in exits.items():
        if isinstance(exit_data, str) and exit_data == target_scene_id:
            return True
        elif isinstance(exit_data, dict):
            if exit_data.get("nextScene") == target_scene_id:
                return True
            for result in exit_data.get("results", []):
                if result.get("nextScene") == target_scene_id or result.get("triggerEvent") == target_scene_id:
                    return True
    
    # Check onEnter effects
    for result in scene_data.get("onEnter", []):
        if result.get("nextScene") == target_scene_id or result.get("triggerEvent") == target_scene_id:
            return True
    
    return False

if __name__ == "__main__":
    print("Scene Validator - Checking all scene connections")
    print("=" * 50)
    
    if not DATA_DIR.exists():
        print(f"ERROR: Data directory '{DATA_DIR}' not found")
        sys.exit(1)
    
    error_count, _ = validate_scenes()
    
    if error_count > 0:
        print("\nValidation FAILED: Found issues that need to be fixed")
        sys.exit(1)
    else:
        print("\nValidation PASSED: All scene connections are valid")
        sys.exit(0) 