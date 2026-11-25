#!/usr/bin/env python3
"""
Facade Parameter Mapping for Paper Trails Laramie
Maps OSM tags to detailed facade generation parameters.
"""

from dataclasses import dataclass, field
from typing import Tuple, Dict, List, Optional
import json

# Color constants (RGBA, 0-1)
BRICK_RED      = (0.65, 0.25, 0.15, 1.0)
BRICK_DARK_RED = (0.50, 0.18, 0.10, 1.0)
BRICK_BROWN    = (0.55, 0.30, 0.18, 1.0)
BRICK_BUFF     = (0.78, 0.70, 0.55, 1.0)
BRICK_YELLOW   = (0.85, 0.75, 0.50, 1.0)
MORTAR_LIGHT   = (0.85, 0.83, 0.78, 1.0)
MORTAR_DARK    = (0.65, 0.62, 0.58, 1.0)
WINDOW_TRIM    = (0.75, 0.72, 0.65, 1.0)
DOOR_WOOD      = (0.40, 0.25, 0.15, 1.0)
DOOR_DARK      = (0.25, 0.15, 0.10, 1.0)
CORNICE_STONE  = (0.75, 0.73, 0.68, 1.0)
TERRACOTTA     = (0.75, 0.35, 0.20, 1.0)
SLATE_GRAY     = (0.35, 0.35, 0.38, 1.0)
SHINGLE_GRAY   = (0.45, 0.43, 0.40, 1.0)
SIGN_RED       = (0.80, 0.20, 0.15, 1.0)
SIGN_GOLD      = (0.90, 0.75, 0.20, 1.0)
SIGN_CREAM     = (0.95, 0.92, 0.85, 1.0)

@dataclass
class FacadeParams:
    # Building classification
    facade_type: str = "residential"
    building_subtype: str = "house"
    
    # Brick
    brick_color: Tuple = BRICK_RED
    brick_variation: float = 0.05
    mortar_color: Tuple = MORTAR_LIGHT
    mortar_thickness: float = 0.008
    
    # Windows
    window_pattern: str = "regular"
    window_width: float = 0.12
    window_height: float = 0.18
    window_sill: float = 0.08
    window_spacing: float = 0.35
    window_lit_prob: float = 0.3
    window_trim_color: Tuple = WINDOW_TRIM
    
    # Doors
    door_pattern: str = "residential"
    door_width: float = 0.16
    door_height: float = 0.26
    door_color: Tuple = DOOR_WOOD
    
    # Cornice
    cornice_style: str = "simple"
    cornice_height: float = 0.025
    cornice_projection: float = 0.03
    cornice_color: Tuple = CORNICE_STONE
    
    # Roof
    roof_type: str = "gable"
    roof_pitch: float = 0.6
    roof_material: str = "terracotta"
    roof_color: Tuple = TERRACOTTA
    
    # Chimney
    chimney_count: int = 1
    chimney_style: str = "brick"
    
    # Signage
    sign_type: str = "none"
    sign_text: str = ""
    sign_color: Tuple = SIGN_CREAM
    
    # Special features
    has_balcony: bool = False
    has_bay_window: bool = False
    has_dormer: bool = False
    dormer_count: int = 0

def classify_facade(osm_tags: Dict, area_m2: float, levels: int) -> FacadeParams:
    """Classify building and return facade parameters based on OSM tags."""
    params = FacadeParams()
    
    building = osm_tags.get('building', 'yes')
    shop = osm_tags.get('shop')
    amenity = osm_tags.get('amenity')
    historic = osm_tags.get('historic')
    tourism = osm_tags.get('tourism')
    name = osm_tags.get('name', '')
    
    # Landmark overrides (highest priority)
    landmark_map = {
        'courthouse': ('landmark', 'courthouse'),
        'townhall': ('landmark', 'civic'),
        'church': ('landmark', 'church'),
        'place_of_worship': ('landmark', 'church'),
        'bank': ('commercial', 'bank'),
        'train_station': ('landmark', 'depot'),
        'museum': ('landmark', 'museum'),
    }
    
    for key, (ftype, subtype) in landmark_map.items():
        if (amenity == key) or (building == key) or (historic == key and key in ['yes', 'church']):
            params.facade_type = ftype
            params.building_subtype = subtype
            return apply_subtype_params(params, subtype, name)
    
    # Commercial detection
    is_commercial = False
    commercial_subtype = 'retail'
    
    if shop:
        is_commercial = True
        commercial_subtype = 'shop'
    elif amenity in ['restaurant', 'cafe', 'pub', 'bar', 'ice_cream', 'nightclub']:
        is_commercial = True
        commercial_subtype = amenity
    elif amenity in ['bank', 'post_office', 'dentist', 'social_facility', 'social_centre']:
        is_commercial = True
        commercial_subtype = 'office'
    elif building in ['retail', 'commercial', 'office']:
        is_commercial = True
        commercial_subtype = building
    elif tourism in ['hotel', 'motel', 'hostel']:
        is_commercial = True
        commercial_subtype = 'hotel'
    
    if is_commercial:
        params.facade_type = 'commercial'
        params.building_subtype = commercial_subtype
        return apply_subtype_params(params, commercial_subtype, name)
    
    # Residential detection
    if building in ['house', 'detached', 'terrace', 'apartments', 'residential']:
        params.facade_type = 'residential'
        params.building_subtype = 'house' if building != 'apartments' else 'apartments'
        return apply_subtype_params(params, params.building_subtype, name)
    
    # Industrial/utility
    if building in ['garage', 'shed', 'warehouse', 'industrial', 'roof']:
        params.facade_type = 'industrial'
        params.building_subtype = building
        return apply_subtype_params(params, params.building_subtype, name)
    
    # Default by area
    if area_m2 < 150:
        params.facade_type = 'residential'
        params.building_subtype = 'house'
    elif area_m2 < 500:
        params.facade_type = 'residential'
        params.building_subtype = 'house'
    else:
        params.facade_type = 'commercial'
        params.building_subtype = 'retail'
    
    return apply_subtype_params(params, params.building_subtype, name)

def apply_subtype_params(params: FacadeParams, subtype: str, name: str) -> FacadeParams:
    """Apply subtype-specific parameter overrides."""
    params.sign_text = name
    
    subtype_configs = {
        # Residential
        'house': {
            'window_pattern': 'regular',
            'window_width': 0.11,
            'window_height': 0.16,
            'window_spacing': 0.32,
            'window_lit_prob': 0.35,
            'door_pattern': 'residential',
            'cornice_style': 'simple',
            'roof_type': 'gable',
            'chimney_count': 1,
        },
        'apartments': {
            'window_pattern': 'regular',
            'window_width': 0.10,
            'window_height': 0.15,
            'window_spacing': 0.28,
            'window_lit_prob': 0.45,
            'door_pattern': 'residential',
            'cornice_style': 'bracketed',
            'roof_type': 'flat',
            'chimney_count': 2,
        },
        
        # Commercial
        'shop': {
            'window_pattern': 'storefront',
            'window_width': 0.25,
            'window_height': 0.35,
            'window_sill': 0.02,
            'window_spacing': 0.15,
            'window_lit_prob': 0.6,
            'door_pattern': 'commercial',
            'door_width': 0.18,
            'door_height': 0.28,
            'cornice_style': 'simple',
            'sign_type': 'awning',
            'sign_color': SIGN_RED,
            'roof_type': 'flat',
            'chimney_count': 0,
        },
        'restaurant': {
            'window_pattern': 'storefront',
            'window_width': 0.22,
            'window_height': 0.32,
            'window_sill': 0.05,
            'window_lit_prob': 0.7,
            'door_pattern': 'commercial',
            'cornice_style': 'bracketed',
            'sign_type': 'blade',
            'sign_color': SIGN_GOLD,
            'roof_type': 'flat',
        },
        'cafe': {
            'window_pattern': 'storefront',
            'window_width': 0.20,
            'window_height': 0.30,
            'window_lit_prob': 0.65,
            'door_pattern': 'commercial',
            'cornice_style': 'simple',
            'sign_type': 'awning',
            'sign_color': SIGN_CREAM,
            'roof_type': 'flat',
        },
        'pub': {
            'window_pattern': 'regular',
            'window_width': 0.14,
            'window_height': 0.20,
            'window_lit_prob': 0.5,
            'door_pattern': 'residential',
            'door_color': DOOR_DARK,
            'cornice_style': 'simple',
            'sign_type': 'blade',
            'sign_color': SIGN_GOLD,
            'roof_type': 'gable',
        },
        'bank': {
            'window_pattern': 'regular',
            'window_width': 0.12,
            'window_height': 0.22,
            'window_trim_color': (0.60, 0.55, 0.45, 1.0),
            'door_pattern': 'commercial',
            'door_width': 0.20,
            'door_height': 0.28,
            'cornice_style': 'modillion',
            'cornice_height': 0.04,
            'sign_type': 'fascia',
            'sign_color': SIGN_GOLD,
            'roof_type': 'flat',
            'brick_color': BRICK_DARK_RED,
            'mortar_color': MORTAR_DARK,
        },
        'office': {
            'window_pattern': 'regular',
            'window_width': 0.13,
            'window_height': 0.20,
            'window_spacing': 0.30,
            'window_lit_prob': 0.4,
            'door_pattern': 'commercial',
            'cornice_style': 'simple',
            'sign_type': 'fascia',
            'roof_type': 'flat',
        },
        'hotel': {
            'window_pattern': 'regular',
            'window_width': 0.10,
            'window_height': 0.16,
            'window_spacing': 0.25,
            'window_lit_prob': 0.5,
            'door_pattern': 'commercial',
            'cornice_style': 'bracketed',
            'sign_type': 'blade',
            'roof_type': 'flat',
            'chimney_count': 2,
        },
        
        # Civic/Landmarks
        'courthouse': {
            'window_pattern': 'arched',
            'window_width': 0.15,
            'window_height': 0.30,
            'window_trim_color': (0.70, 0.65, 0.55, 1.0),
            'door_pattern': 'double',
            'door_width': 0.24,
            'door_height': 0.32,
            'cornice_style': 'modillion',
            'cornice_height': 0.05,
            'cornice_projection': 0.05,
            'roof_type': 'hip',
            'roof_pitch': 0.4,
            'brick_color': BRICK_DARK_RED,
            'mortar_color': MORTAR_DARK,
            'chimney_count': 4,
        },
        'church': {
            'window_pattern': 'arched',
            'window_width': 0.12,
            'window_height': 0.40,
            'window_sill': 0.15,
            'window_trim_color': (0.72, 0.68, 0.60, 1.0),
            'door_pattern': 'arched',
            'door_width': 0.20,
            'door_height': 0.35,
            'cornice_style': 'dentil',
            'roof_type': 'gable',
            'roof_pitch': 0.8,
            'roof_material': 'slate',
            'roof_color': SLATE_GRAY,
            'chimney_count': 0,
            'has_dormer': False,
        },
        'civic': {
            'window_pattern': 'regular',
            'window_width': 0.14,
            'window_height': 0.24,
            'door_pattern': 'double',
            'cornice_style': 'modillion',
            'roof_type': 'hip',
            'brick_color': BRICK_BROWN,
        },
        'depot': {
            'window_pattern': 'regular',
            'window_width': 0.16,
            'window_height': 0.22,
            'door_pattern': 'commercial',
            'door_width': 0.22,
            'cornice_style': 'bracketed',
            'sign_type': 'fascia',
            'roof_type': 'hip',
            'brick_color': BRICK_BUFF,
        },
        'museum': {
            'window_pattern': 'regular',
            'window_width': 0.12,
            'window_height': 0.22,
            'cornice_style': 'modillion',
            'roof_type': 'flat',
            'sign_type': 'fascia',
        },
        
        # Industrial
        'garage': {
            'window_pattern': 'industrial',
            'window_width': 0.20,
            'window_height': 0.18,
            'door_pattern': 'garage',
            'door_width': 0.35,
            'door_height': 0.30,
            'cornice_style': 'none',
            'roof_type': 'gable',
            'roof_material': 'metal',
        },
        'warehouse': {
            'window_pattern': 'industrial',
            'window_width': 0.18,
            'window_height': 0.20,
            'window_spacing': 0.40,
            'door_pattern': 'loading',
            'door_width': 0.40,
            'door_height': 0.40,
            'cornice_style': 'none',
            'roof_type': 'flat',
            'roof_material': 'membrane',
            'brick_color': BRICK_BROWN,
        },
    }
    
    if subtype in subtype_configs:
        for key, value in subtype_configs[subtype].items():
            setattr(params, key, value)
    
    # Adjust for building height
    if params.facade_type == 'residential' and params.building_subtype == 'house':
        # Multi-story houses get slightly different proportions
        pass
    
    return params

# For testing
if __name__ == "__main__":
    # Test classification
    test_tags = [
        {'building': 'yes', 'shop': 'clothes', 'name': 'Dodds Shoe Co.'},
        {'building': 'yes', 'amenity': 'pub', 'name': 'The Library'},
        {'building': 'yes', 'amenity': 'courthouse', 'name': 'Albany County Courthouse'},
        {'building': 'church', 'name': 'St. Matthews Cathedral'},
        {'building': 'yes', 'amenity': 'bank', 'name': 'First Interstate Bank'},
        {'building': 'house', 'name': ''},
        {'building': 'yes', 'name': ''},
    ]
    
    for i, tags in enumerate(test_tags):
        area = 500 if i < 3 else 100
        levels = 2 if i < 3 else 1
        params = classify_facade(tags, area, levels)
        print(f"\nTags: {tags}")
        print(f"  Type: {params.facade_type}/{params.building_subtype}")
        print(f"  Windows: {params.window_pattern} {params.window_width}x{params.window_height}")
        print(f"  Door: {params.door_pattern} {params.door_width}x{params.door_height}")
        print(f"  Cornice: {params.cornice_style}")
        print(f"  Roof: {params.roof_type} {params.roof_material}")
        print(f"  Sign: {params.sign_type} '{params.sign_text}'")