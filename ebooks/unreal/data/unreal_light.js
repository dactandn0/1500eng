const UNREAL_DATA_LIGHT = [
{
	title:"Devotion light"
	,en:"The warm, moody lighting in your image (likely from a horror or nostalgia-themed game) is achieved using several specific Unreal Engine lighting techniques. Here's how you can replicate this look in Unreal Engine 4.27 or UE5:<br>\
<br>\
✅ 1. Directional Light (Sunlight) Setup<br>\
Type: Directional Light<br>\
<br>\
Mobility: Stationary or Movable (for dynamic shadows)<br>\
Light Color: Warm orange-yellow (e.g. #FFB347)<br>\
Intensity: Around 4-8 lux (adjust to taste)<br>\
Use Temperature: Check this to fine-tune warmth (e.g., 4500K–5500K)<br>\
Source Angle: ~5° for soft shadows (especially for window blinds)<br>\
<br>\
✅ 2. Light Shaft Effect (God Rays)<br>\
To achieve the visible sunbeams coming through the window:<br>\
<br>\
Enable 'Light Shafts' in the Directional Light:<br>\
Light Shaft Bloom: ON<br>\
Bloom Tint: Warm color (e.g. orange/yellow)<br>\
Bloom Scale: ~0.3 to 1.0<br>\
Bloom Threshold: ~ 0.5<br>\
<br>\
Under Project Settings > Rendering, enable:<br>\
Light Shafts<br>\
Volumetric Fog (if using UE4.24+)<br>\
<br>\
✅ 3. Volumetric Fog (for dusty atmosphere)<br>\
This helps create the visible particles floating in the air:<br>\
<br>\
Add Exponential Height Fog actor to the scene.<br>\
Enable Volumetric Fog in the fog settings.<br>\
Add subtle fog in-scattering color (warm tone).<br>\
Play with:<br>\
+ Fog Density: 0.01–0.05<br>\
+ Scattering Distribution: -0.2 to 0.2<br>\
<br>\
✅ 4. Window Light Mask (Sun Through Blinds)<br>\
That sunlight strip pattern on the bed likely comes from:<br>\
<br>\
Option 1: Geometry with Cutouts<br>\
Model curtain blinds or wooden slats with holes or gaps.<br>\
Let sunlight pass through them to create realistic shadows.<br>\
<br>\
Option 2: Fake with Light Function<br>\
Create a Light Function Material:<br>\
Black-and-white image with stripe or pattern (for blinds).<br>\
Use it in the Directional Light > Light Function Material slot.<br>\
<br>\
✅ 5. Post Process Volume<br>\
For the warm, nostalgic tone:<br>\
<br>\
Add Post Process Volume, set to Unbound (affects the whole level).<br>\
Exposure:<br>\
Min/Max Brightness: 1.0 (to avoid auto exposure flicker)<br>\
Color Grading:<br>\
<br>\
Global > Temperature: +15 to +30<br>\
Shadows: Add slight reddish tone<br>\
Contrast: Slight boost (~1.05–1.1)<br>\
Add Bloom: Threshold ~1.0, Intensity ~0.3 (optional for glow)<br>\
<br>\
✅ 6. Additional Tips<br>\
Dust particles: Add particle systems like floating dust (Niagara or Cascade).<br>\
Use soft shadows and baked lighting for props to ground them.<br>\
Optional: Add SSR (Screen Space Reflections) and rough surfaces for realism."
	,images:["devo-light"]
}
]