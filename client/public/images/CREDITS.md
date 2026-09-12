# Asset provenance

## Matching Mirashya listing assets

The 43 photographs in `mirashya/`, the green Mirashya host image and the illustrated search icon were obtained from rendered image URLs on the [same public Airbnb listing](https://www.airbnb.co.in/rooms/1599895892448055764), observed on 12 September 2026. They are used to reproduce the property in the user's reference screenshots for this private take-home submission.

- Per-photo source URLs: [asset-manifest.json](../../../docs/reference/asset-manifest.json).
- Other observed image/font URLs: [observed-assets.json](../../../docs/reference/observed-assets.json).
- Collection script: [collect-reference-assets.mjs](../../../scripts/collect-reference-assets.mjs).
- Typeface: Airbnb Cereal variable font, stored at `../fonts/cereal.woff2`; the exact observed source is recorded in the asset observations.

These third-party assets remain owned by their respective rights holders. Public visibility is not a grant of a general redistribution licence. No deployed application JavaScript or CSS was copied.

## Remaining fixture photography

The earlier project used Pexels photographs for its alternate listing, nearby stays and avatars. Those files are retained and credited below under the [Pexels License](https://www.pexels.com/license/). Some of these fixture images still appear outside the main photo tour.

## Legacy Pexels fixtures

| Asset type | Size | Aspect | Format |
|---|---|---|---|
| Property photos (34) | 1440 × 960 | 3:2 | WebP |
| Avatars (7) | 240 × 240 | 1:1 | WebP |

Cropping is applied by the Pexels CDN (`fit=crop`) so every master is exactly 3:2,
matching the measured reference.

## Legacy property photos — `listings/listing-001/`

Files are named `<room-slug>-NN.webp`. Gallery display order puts the **lead photo of each
room first** (positions 1–9), then the remainder grouped by room — see
ASSET_INVENTORY.md §3.

| Room | File | Pexels ID | Source |
|---|---|---|---|
| Living room | `living-room-01.webp` *(gallery hero)* | 280239 | https://www.pexels.com/photo/280239/ |
| Living room | `living-room-02.webp` | 8089172 | https://www.pexels.com/photo/8089172/ |
| Living room | `living-room-03.webp` | 7546648 | https://www.pexels.com/photo/7546648/ |
| Living room | `living-room-04.webp` | 6980724 | https://www.pexels.com/photo/6980724/ |
| Living room | `living-room-05.webp` | 8584020 | https://www.pexels.com/photo/8584020/ |
| Full kitchen | `full-kitchen-01.webp` *(gallery tile 2)* | 7195739 | https://www.pexels.com/photo/7195739/ |
| Full kitchen | `full-kitchen-02.webp` | 6265836 | https://www.pexels.com/photo/6265836/ |
| Full kitchen | `full-kitchen-03.webp` | 8146322 | https://www.pexels.com/photo/8146322/ |
| Full kitchen | `full-kitchen-04.webp` | 6908565 | https://www.pexels.com/photo/6908565/ |
| Dining area | `dining-area-01.webp` *(gallery tile 3)* | 3935317 | https://www.pexels.com/photo/3935317/ |
| Dining area | `dining-area-02.webp` | 4119832 | https://www.pexels.com/photo/4119832/ |
| Dining area | `dining-area-03.webp` | 4221404 | https://www.pexels.com/photo/4221404/ |
| Bedroom 1 | `bedroom-1-01.webp` *(gallery tile 4)* | 15456211 | https://www.pexels.com/photo/15456211/ |
| Bedroom 1 | `bedroom-1-02.webp` | 13043955 | https://www.pexels.com/photo/13043955/ |
| Bedroom 1 | `bedroom-1-03.webp` | 9899871 | https://www.pexels.com/photo/9899871/ |
| Bedroom 1 | `bedroom-1-04.webp` | 6903157 | https://www.pexels.com/photo/6903157/ |
| Bedroom 1 | `bedroom-1-05.webp` | 13722872 | https://www.pexels.com/photo/13722872/ |
| Bedroom 2 | `bedroom-2-01.webp` *(gallery tile 5)* | 6934170 | https://www.pexels.com/photo/6934170/ |
| Bedroom 2 | `bedroom-2-02.webp` | 8135505 | https://www.pexels.com/photo/8135505/ |
| Bedroom 2 | `bedroom-2-03.webp` | 3754698 | https://www.pexels.com/photo/3754698/ |
| Bedroom 2 | `bedroom-2-04.webp` | 14631824 | https://www.pexels.com/photo/14631824/ |
| Full bathroom 1 | `full-bathroom-1-01.webp` | 6957081 | https://www.pexels.com/photo/6957081/ |
| Full bathroom 1 | `full-bathroom-1-02.webp` | 29887333 | https://www.pexels.com/photo/29887333/ |
| Full bathroom 1 | `full-bathroom-1-03.webp` | 7031840 | https://www.pexels.com/photo/7031840/ |
| Full bathroom 2 | `full-bathroom-2-01.webp` | 8082195 | https://www.pexels.com/photo/8082195/ |
| Full bathroom 2 | `full-bathroom-2-02.webp` | 7005268 | https://www.pexels.com/photo/7005268/ |
| Full bathroom 2 | `full-bathroom-2-03.webp` | 6903210 | https://www.pexels.com/photo/6903210/ |
| Exterior | `exterior-01.webp` | 14846410 | https://www.pexels.com/photo/14846410/ |
| Exterior | `exterior-02.webp` | 11631278 | https://www.pexels.com/photo/11631278/ |
| Exterior | `exterior-03.webp` | 18587809 | https://www.pexels.com/photo/18587809/ |
| Exterior | `exterior-04.webp` | 14998334 | https://www.pexels.com/photo/14998334/ |
| Pool | `pool-01.webp` | 2259226 | https://www.pexels.com/photo/2259226/ |
| Pool | `pool-02.webp` | 2222614 | https://www.pexels.com/photo/2222614/ |
| Pool | `pool-03.webp` | 17957047 | https://www.pexels.com/photo/17957047/ |

## Avatars

| Use | File | Pexels ID | Source |
|---|---|---|---|
| Host (Sangita) | `hosts/host-001.webp` | 415829 | https://www.pexels.com/photo/415829/ |
| Host (Arjun) | `hosts/host-002.webp` | 220453 | https://www.pexels.com/photo/220453/ |
| Reviewer 1 | `guests/guest-001.webp` | 771742 | https://www.pexels.com/photo/771742/ |
| Reviewer 2 | `guests/guest-002.webp` | 774909 | https://www.pexels.com/photo/774909/ |
| Reviewer 3 | `guests/guest-003.webp` | 1222271 | https://www.pexels.com/photo/1222271/ |
| Reviewer 4 | `guests/guest-004.webp` | 1858175 | https://www.pexels.com/photo/1858175/ |
| Reviewer 5 | `guests/guest-005.webp` | 2379004 | https://www.pexels.com/photo/2379004/ |


## Vectors and icons

The brand mark was recreated in SVG for reference fidelity. General interface icons use `lucide-react` (ISC licence), with a few original SVG drawings. The location-map backdrop is an original CSS illustration; it is not an interactive third-party map service.

The separate production architecture SVG and PNG were generated from original project code in `scripts/render-architecture.mjs`.
