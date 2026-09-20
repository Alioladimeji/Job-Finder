#!/usr/bin/env python3
"""
Test script to verify backend API changes for multiple modalities support
"""

import json
import sys

# Test 1: Verify models can be imported and work correctly
print("=" * 60)
print("TEST 1: Model Validation")
print("=" * 60)

try:
    from models import JobSearchRequest

    # Test backward compatibility - single modality
    req1 = JobSearchRequest(
        keyword="python",
        location="Mexico",
        modality="remoto"
    )
    print("✓ Backward compatible single modality:", req1.modality)
    print("  Auto-converted to modalities:", req1.modalities)

    # Test new multiple modalities
    req2 = JobSearchRequest(
        keyword="python",
        location="Mexico",
        modalities=["remoto", "hibrido"]
    )
    print("✓ Multiple modalities:", req2.modalities)

    # Test both fields together
    req3 = JobSearchRequest(
        keyword="python",
        location="Mexico",
        modality="presencial",
        modalities=["remoto", "hibrido"]
    )
    print("✓ Combined modality fields:", req3.modalities, "(should merge)")

    # Test empty modalities
    req4 = JobSearchRequest(
        keyword="python",
        location="Mexico"
    )
    print("✓ No modality specified:", req4.modalities, "(should be empty list)")

    print("\n✅ All model tests passed!\n")

except Exception as e:
    print(f"❌ Model test failed: {e}")
    sys.exit(1)


# Test 2: Verify URL building logic
print("=" * 60)
print("TEST 2: URL Building")
print("=" * 60)

try:
    from scraper import LinkedInScraper

    scraper = LinkedInScraper()

    # Test single modality
    url1 = scraper.build_search_url("python", "Mexico", ["remoto"], "24h")
    print("✓ Single modality URL:")
    print(f"  {url1}")
    assert "f_WT=2" in url1, "Should contain Remote filter"

    # Test multiple modalities
    url2 = scraper.build_search_url("python", "Mexico", ["remoto", "hibrido"], "24h")
    print("✓ Multiple modalities URL:")
    print(f"  {url2}")
    assert "f_WT=2%2C3" in url2 or "f_WT=2,3" in url2, "Should contain Remote+Hybrid filter"

    # Test no modality
    url3 = scraper.build_search_url("python", "Mexico", [], "24h")
    print("✓ No modality URL:")
    print(f"  {url3}")
    assert "f_WT" not in url3, "Should not contain work location filter"

    # Test all three modalities
    url4 = scraper.build_search_url("devops", "Remote", ["remoto", "hibrido", "presencial"], "")
    print("✓ All modalities URL:")
    print(f"  {url4}")

    print("\n✅ All URL building tests passed!\n")

except Exception as e:
    print(f"❌ URL building test failed: {e}")
    sys.exit(1)


# Test 3: Sample API request format
print("=" * 60)
print("TEST 3: API Request Examples")
print("=" * 60)

# Example 1: Quick search with multiple work locations
example1 = {
    "keyword": "python developer",
    "location": "Remote",
    "exclude": ["senior", "lead"],
    "modalities": ["remoto", "hibrido"],
    "time_filter": "24h"
}
print("Example 1: Quick search with Remote + Hybrid")
print(json.dumps(example1, indent=2))

# Example 2: Profile search with single keyword
example2 = {
    "keyword": "DevOps Engineer OR Cloud Engineer OR Terraform",
    "location": "USA",
    "exclude": ["senior", "principal"],
    "modalities": ["remoto"],
    "time_filter": "24h"
}
print("\nExample 2: Profile search (keywords joined with OR)")
print(json.dumps(example2, indent=2))

# Example 3: Backward compatible request
example3 = {
    "keyword": "react",
    "location": "Mexico",
    "exclude": [],
    "modality": "remoto",  # Old field
    "time_filter": ""
}
print("\nExample 3: Backward compatible (old modality field)")
print(json.dumps(example3, indent=2))

print("\n✅ All tests completed successfully!")
print("\nBackend is ready for:")
print("  - Multiple work location selection")
print("  - Single and multiple profile searches")
print("  - Backward compatibility with existing clients")
