# Gallery Instructions - How to Add Your Images

## Quick Start

1. **Add your images** to the `photos/` folder
2. **Edit the gallery.html file** around line 560 where you see the `galleryData` array
3. **Add your image entries** following the format below

## Image Entry Format

```javascript
{
    id: 4,                           // Unique number (increment for each new image)
    category: 'events',              // Choose: 'events', 'workshops', 'hackathons', 'team', 'projects'
    title: 'Your Event Title',       // Title that appears on hover
    description: 'Brief description', // Description that appears on hover
    height: 300,                     // Height in pixels (200-400 works well)
    width: 1,                        // 1 for portrait, 2 for landscape (spans 2 columns)
    orientation: 'portrait',         // 'portrait' or 'landscape'
    image: 'photos/your-image.jpg'   // Path to your image file
},
```

## Categories Available
- **events** - Conferences, meetups, talks
- **workshops** - Learning sessions, tutorials
- **hackathons** - Coding competitions, hackathons
- **team** - Team photos, behind the scenes
- **projects** - Project showcases, demos

## Image Guidelines
- **File formats**: JPG, PNG, WebP
- **Size**: Optimize images (under 1MB recommended)
- **Dimensions**: 
  - Portrait: 400-800px wide
  - Landscape: 800-1200px wide
- **Names**: Use descriptive filenames (no spaces, use hyphens)

## Example: Adding a New Image

1. Save your image as `photos/hackathon-2024.jpg`
2. In gallery.html, find the `galleryData` array
3. Add this entry:

```javascript
{
    id: 4,
    category: 'hackathons',
    title: 'Hackathon 2024 Winners',
    description: 'Our amazing winners from the annual hackathon',
    height: 280,
    width: 2,
    orientation: 'landscape',
    image: 'photos/hackathon-2024.jpg'
},
```

## Tips
- **Portrait images** (width: 1) work well for people, individual shots
- **Landscape images** (width: 2) work well for group photos, wide scenes
- **Height values** between 200-400 create nice variety in the layout
- **Don't forget the comma** after each entry (except the last one)
- **Test your gallery** by opening gallery.html in a browser

## Filter System
The gallery includes category filters at the top. Users can click:
- **All** - Shows all images
- **Events** - Shows only event images
- **Workshops** - Shows only workshop images
- **Hackathons** - Shows only hackathon images
- **Team** - Shows only team images
- **Projects** - Shows only project images

## Need Help?
If you run into issues:
1. Check the browser console for errors (F12)
2. Make sure image paths are correct
3. Verify JSON syntax (commas, brackets)
4. Ensure image files exist in the photos folder