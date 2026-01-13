# UTM Schema & Conventions
Use consistent UTMs on every outbound link to WhatsApp, site pages, and GBP/IG/FB bios so GA4 can attribute WA conversations and site visits.

## Base fields
- `utm_source`: channel (ig, fb, gbp, meta, email, partner)
- `utm_medium`: placement/type (bio, post, story, reel, c2w, ad, sms, wa, referral)
- `utm_campaign`: short descriptor (pricing, safety, zone-koramangala, zone-indiranagar, testimonial, retargeting, referral, promo-<mmYYYY>)
- `utm_content`: optional detail (e.g., creative variant `reel1`, `carousel2`, `story-poll`)

## Examples
- Instagram bio WA link: `?utm_source=ig&utm_medium=bio&utm_campaign=always-on`
- IG Reel CTA (pricing): `?utm_source=ig&utm_medium=reel&utm_campaign=pricing&utm_content=reel1`
- Facebook post CTA (safety): `?utm_source=fb&utm_medium=post&utm_campaign=safety&utm_content=carousel1`
- GBP appointment/WA link: `?utm_source=gbp&utm_medium=profile&utm_campaign=always-on`
- Meta click-to-WhatsApp ad (pricing): `?utm_source=meta&utm_medium=c2w&utm_campaign=pricing`
- Retargeting ad (site visitors): `?utm_source=meta&utm_medium=c2w&utm_campaign=retargeting&utm_content=visitors`
- Referral share link: `?utm_source=referral&utm_medium=wa&utm_campaign=friendshare`

## Notes
- Keep names lowercase with hyphens for multi-word campaign tags.
- Reuse `utm_campaign` labels across channels when intent is the same (pricing, safety, testimonial, zone-<area>).
- For offline/partner QR codes: embed WA link with UTM (`utm_source=partner&utm_medium=qr&utm_campaign=zone-<area>`).
