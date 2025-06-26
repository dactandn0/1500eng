const UNREAL_DATA_MATERIAL = [
{
	title:"Opacity mask & SuperPNG for PTS"
	,en:"Mask is Alpha chanel"
	,images:["opacity_mask-min","super_png-min"]
},{
	title:"RGB_mask_for_variation_Material"
	,en:""
	,images:[
		"RGB_mask_for_variation_Material00-min",
		"RGB_mask_for_variation_Material01-min",
		"RGB_mask_for_variation_Material02-min",
		"RGB_mask_for_variation_Material03-min",
		"RGB_mask_for_variation_Material04-min",
		"RGB_mask_for_variation_Material05-min",
		"RGB_mask_for_variation_Material06-min",
	]
},{
	title:"Emissive Mask"
	,en:"One of the most common things to do with a Mask Texture is to use it to control the Emissive sections of a Material. This is usually done by first creating a Emissive Mask texture that uses White to define what sections of the Material should be Emissive and then multiplying that Mask texture by a color inside the Material Editor. This is generally done so that you have more control over the look and intensity of the Emissive effect. In the following example, we can see Emissive Texture Masking in action."
	,images:["emissive_mask_material-min"]
},{
	title:"POM"
	,en:"In Unreal Engine, POM is an advanced technique that enhances the visual realism of surfaces by simulating the appearance of depth and surface detail without adding geometry. It works by manipulating texture coordinates in a shader to create the illusion of complex surface features, like bumps, grooves, or cavities, that react to light and viewing angle."
	,images:["POM-min"]
},
{
	title:"[PP] Radial Blur"
	,en:"float2 uv = GetViewportUV(Parameters);<br>\
float4 color = SceneTextureLookup(ClampSceneTextureUV(ViewportUVToSceneTextureUV(uv, 14), 14), 14, false);<br>\
float4 sceneColor = color;<br>\
float kernel[10] = {-.8, -.5, -.3, -.2, -.1, .1, .2, .3, .5, .8};<br>\
float2 Direction = uv - Position.xy;<br>\
for(int i = 0; i < 10; i++)<br>\
{<br>\
    float2 offsetUV = uv + Direction * kernel[i] * PixelSize * Radius;<br>\
    offsetUV = saturate(offsetUV);<br>\
    float4 sampleColor = SceneTextureLookup(ClampSceneTextureUV(ViewportUVToSceneTextureUV(offsetUV, 14), 14), 14, false);<br>\
<br>\
    color += sampleColor;<br>\
}<br>\
color /= 11;<br>\
float4 blurredColor = lerp(color, sceneColor, Mask);<br>\
return blurredColor;<br>\
}<hr>\
This is a Custom HLSL node used in a Post Process Material in Unreal Engine to implement a Radial Blur effect.<br>\
Let’s break it down:<br>\
🧠 What it Does:<br>\
This code performs the following:<br>\
Takes the UV coordinate of the screen<br>\
Calculates the direction vector from the screen center (or another point) outward<br>\
Samples the scene color multiple times along that direction<br>\
Averages those samples (blur)<br>\
Blends the result with the original image based on a Mask (like a radial gradient)<br>\
Returns the final blurred color<br>\
<br>\
🧩 Breakdown of Key Parts<br>\
🔹 Get UV and Scene Color<br>\
float2 uv = GetViewportUV(Parameters);<br>\
float4 color = SceneTextureLookup(...);<br>\
float4 sceneColor = color;<br>\
<br>\
Gets the current screen UV<br>\
Looks up the base color of the screen (SceneColor)<br>\
<br>\
🔹 Direction for Blur<br>\
float2 Direction = uv - Position.xy;<br>\
Computes direction from a center point (Position.xy, likely a parameter or uniform center like (0.5, 0.5))<br>\
<br>\
🔹 Blur Kernel Loop<br>\
float kernel[10] = {-.8, -.5, -.3, -.2, -.1, .1, .2, .3, .5, .8};<br>\
<br>\
for(int i = 0; i < 10; i++)<br>\
{<br>\
    float2 offsetUV = uv + Direction * kernel[i] * PixelSize * Radius;<br>\
    offsetUV = saturate(offsetUV);<br>\
    float4 sampleColor = SceneTextureLookup(...);<br>\
    color += sampleColor;<br>\
}<br>\
Takes 10 blur samples along the vector from center to pixel<br>\
Uses kernel[] weights for spacing<br>\
Adds them to build the blur<br>\
<br>\
🔹 Blend & Output<br>\
color /= 11;<br>\
float4 blurredColor = lerp(color, sceneColor, Mask);<br>\
return blurredColor;<br>\
<br>\
Averages the result<br>\
lerp() blends between original and blurred image using a Mask (e.g. radial gradient)<br>\
Outputs the final blurred color<br>\
<br>\
📌 What You Need to Make This Work<br>\
Inputs to the Custom Node:<br>\
float2 Position → usually (0.5, 0.5) (center of screen)<br>\
float Radius → strength of blur<br>\
float2 PixelSize → use (1.0 / ScreenWidth, 1.0 / ScreenHeight)<br>\
float Mask → radial mask (0–1) that controls where blur applies<br>\
<br>\
✅ Summary<br>\
This script = Custom radial blur logic done in shader HLSL inside a Custom node in a Post Process Material. It's optimized and flexible — very useful in horror, hit impact, time warp, or spiritual effects.<br>\
"
,images:["Radial_Blur_PP"]
}
]