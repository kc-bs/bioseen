# BioSeen remake report

Source: https://bioseen.com (live, fetched 2026-10-31)
Target: this repository (kc-bs/bioseen), a faithful copy of the static site

## Status

**REMAKE COMPLETE**: every file the live site publicly serves is in this repository, byte-identical to the live copy. Two items can't be fetched from the public site and need the site owner (see "Open items").

## Files

| File | Live vs repo |
| --- | --- |
| `index.html` | byte-identical |
| `style.css` | byte-identical |
| `script.js` | byte-identical |
| `attached_assets/Bioseen_Logo_Horizontal_White_Txt@3x_1759411101901.png` | byte-identical |
| `attached_assets/stock_images/benchtop_nmr_nuclear_94a59365.jpg` | byte-identical |
| `attached_assets/stock_images/dna_sequencing_genom_b8513ecb.jpg` | byte-identical |
| `attached_assets/stock_images/flow_cytometry_labor_74b6e744.jpg` | byte-identical |
| `attached_assets/stock_images/gas_chromatography_a_05b17228.jpg` | byte-identical |
| `attached_assets/stock_images/mass_spectrometry_ch_f2260cf9.jpg` | byte-identical |
| `attached_assets/stock_images/medical_laboratory_c_5fa37c3a.jpg` | byte-identical |
| `attached_assets/stock_images/modern_laboratory_sc_557cac1b.jpg` | byte-identical (used as hero background in `style.css`) |
| `attached_assets/stock_images/scientist_microscope_bc021127.jpg` | byte-identical (same image content as `modern_laboratory_sc_557cac1b.jpg`) |

External dependencies, loaded from CDNs as on the live site: Font Awesome 6.4.0 (cdnjs) and the Inter font (Google Fonts).

The site has no favicon, `robots.txt`, `sitemap.xml` or web manifest; all return 404 on the live site.

## Render check

I served the repo locally and loaded it in a browser next to the live site:

- Page title: identical
- Sections: `home, about, solutions, genomics, instruments, consumables, preanalytics, services, contact` on both
- Visible text: 6,148 characters on both
- Images: 9 of 9 load on both
- Hero background, Font Awesome icons and nav dropdown: render the same

## Open items (need the site owner)

1. **Corporate profile PDF is missing.** `index.html` links "Download Catalog" to `attached_assets/BioSeen_Corporate_Profile_1759827557939.pdf`, but the live server returns **403 Forbidden** for it, so the button is broken on the live site too. Add the PDF at that path to fix it.
2. **Contact form backend is not included.** `script.js` POSTs the contact form to `contact-handler.php`. That file runs on the server, so its source can't be downloaded (the live endpoint answers GET with 405). Without it, the form shows its error message when served from this repo. Copy the PHP file from the server, or point the form at another handler.

## Running locally

Serve the folder with any static server and open `index.html`, for example `python -m http.server`. The contact form needs a PHP host.
