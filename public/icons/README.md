# Desktop icons

Icons in this folder are used on the Michael Jones desktop and in windows. They are copied from the named PNGs in `MacOS9-icons-master/icns extracted_from_rsrc/` (the *_icon_png_* subfolders). To refresh after converting new .icns files, run from project root:

```bash
BASE="MacOS9-icons-master/icns extracted_from_rsrc"
cp "$BASE"/listen_now_icon_png_*/listen_now_icon_256x256.png public/icons/listen_now_icon.png
cp "$BASE"/presave_icon_png_*/presave_icon_256x256.png public/icons/presave_icon.png
cp "$BASE"/shows_tour_icon_png_*/shows_tour_icon_256x256.png public/icons/shows_tour_icon.png
cp "$BASE"/social_media_icon_png_*/social_media_icon_256x256.png public/icons/social_media_icon.png
cp "$BASE"/trash_icon_demos_png_*/trash_icon_demos_256x256.png public/icons/trash_icon_demos.png
cp "$BASE"/song_icon_png_*/song_icon_256x256.png public/icons/song_icon.png
cp "$BASE"/epk_icon_png_*/epk_icon_256x256.png public/icons/epk_icon.png
cp "$BASE"/folder_icon_png_*/folder_icon_256x256.png public/icons/folder_icon.png
cp "$BASE"/contact_icon_png_*/contact_icon_256x256.png public/icons/contact_icon.png
cp "$BASE"/finder_icon_png_*/finder_icon_256x256.png public/icons/finder_icon.png
cp "$BASE"/file_icon_png_*/file_icon_256x256.png public/icons/file_icon.png
cp "$BASE"/blog_icon_png_*/blog_icon_256x256.png public/icons/blog_icon.png
cp "MacOS9-icons-master/icns extracted_from_rsrc/README icon_png_"*"/README icon_256x256.png" public/icons/README_icon.png
```
