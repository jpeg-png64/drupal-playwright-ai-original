# Test Inputs — Index

Every test's exact inputs, one file per block. Inputs include: helper call + config, page title, section name, and hardcoded values inside helpers.

| Block                 | Spec                                | Tests | File                                             |
| --------------------- | ----------------------------------- | ----- | ------------------------------------------------ |
| Accordion             | `tests/accordion.spec.js`           | 1     | [accordion.md](accordion.md)                     |
| Event Carousel        | `tests/event-carousel.spec.js`      | 2     | [event-carousel.md](event-carousel.md)           |
| Icon & Text Highlight | `tests/icon-text-highlight.spec.js` | 1     | [icon-text-highlight.md](icon-text-highlight.md) |
| Image                 | `tests/image.spec.js`               | 2     | [image.md](image.md)                             |
| Image Grid            | `tests/image-grid.spec.js`          | 8     | [image-grid.md](image-grid.md)                   |
| Navigation Menu       | `tests/navigation-menu.spec.js`     | 1     | [navigation-menu.md](navigation-menu.md)         |
| Next / Previous       | `tests/next-previous.spec.js`       | 2     | [next-previous.md](next-previous.md)             |
| Page Title            | `tests/page-title.spec.js`          | 2     | [page-title.md](page-title.md)                   |
| Profile Details       | `tests/profile-details.spec.js`     | 1     | [profile-details.md](profile-details.md)         |
| Profile Listing       | `tests/profile-listing.spec.js`     | 1     | [profile-listing.md](profile-listing.md)         |
| Slideshow             | `tests/slideshow.spec.js`           | 2     | [slideshow.md](slideshow.md)                     |
| Text Area             | `tests/text-area.spec.js`           | 1     | [text-area.md](text-area.md)                     |
| Three-Col Carousel    | `tests/three-col-carousel.spec.js`  | 1     | [three-col-carousel.md](three-col-carousel.md)   |
| Video                 | `tests/video.spec.js`               | 2     | [video.md](video.md)                             |
| Views                 | combined only                      | —     | [views.md](views.md)                             |
| YouTube               | `tests/youtube.spec.js`             | 1     | [youtube.md](youtube.md)                         |

## Media library

Available media items on the site (match by name/title, e.g. `"1170_home.png"` or `"people-profile-picture.jpg"`):

| Name                                     | Type  |
| ---------------------------------------- | ----- |
| `private_testing_staff.pdf`              | doc   |
| `people-profile-picture.jpg` (×2)        | image |
| `1170_home.png`                          | image |
| `1170x500_bg.jpg`                        | image |
| `image-placeholder-w720px-h480px.png`    | image |
| `image-placeholder-w720px-h540px.png`    | image |
| `placeholder_slide_02_mobile.jpg`        | image |
| `image-placeholder-2.jpg`                | image |
| `placeholder_slide_01_mobile.jpg`        | image |
| `image-placeholder_slide_01_desktop.jpg` | image |
| `placeholder_slide_01_desktop.jpg`       | image |
| `image-placeholder_slide_02_desktop.jpg` | image |
| `placeholder_slide_02_desktop.jpg`       | image |

The media-library modal shows titles (often the filename). Matching is case-insensitive substring against the item's text, image `alt`, `title`, and `data-title`.
