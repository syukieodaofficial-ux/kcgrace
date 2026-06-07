#!/usr/bin/env python3
"""
fetch_fb_feed.py
Fetches the latest posts from a Facebook Page using the Graph API and writes to fb-feed.json

Usage:
  python fetch_fb_feed.py --page-id PAGE_ID --access-token PAGE_ACCESS_TOKEN --limit 5 --output fb-feed.json

Requires: requests (pip install requests)
"""
import argparse
import json
import sys
from datetime import datetime

try:
    import requests
except ImportError:
    print('This script requires the requests library. Install with: pip install requests')
    sys.exit(1)

API_VERSION = 'v17.0'

def fetch_feed(page_id, access_token, limit=5):
    fields = 'message,created_time,id,full_picture,permalink_url'
    url = f'https://graph.facebook.com/{API_VERSION}/{page_id}/feed'
    params = {
        'fields': fields,
        'limit': limit,
        'access_token': access_token
    }
    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    return r.json()


def normalize_feed(page_id, raw):
    posts = []
    for item in raw.get('data', []):
        posts.append({
            'id': item.get('id'),
            'message': item.get('message', '').strip(),
            'created_time': item.get('created_time'),
            'full_picture': item.get('full_picture'),
            'permalink_url': item.get('permalink_url')
        })
    return {
        'page': page_id,
        'url': f'https://www.facebook.com/{page_id}',
        'fetched_at': datetime.utcnow().isoformat() + 'Z',
        'posts': posts
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--page-id', required=True)
    p.add_argument('--access-token', required=True)
    p.add_argument('--limit', type=int, default=5)
    p.add_argument('--output', default='fb-feed.json')
    args = p.parse_args()

    try:
        raw = fetch_feed(args.page_id, args.access_token, limit=args.limit)
    except Exception as e:
        print('Error fetching feed:', e)
        sys.exit(2)

    out = normalize_feed(args.page_id, raw)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print('Wrote', args.output)

if __name__ == '__main__':
    main()
