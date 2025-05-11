const UNREAL_DATA_R = [
{
	title:"Displacement in UE4"
	,en:"Setting Up Displacement in UE4:<br>\
Create or Import a Displacement Map (typically a height map).<br>\
<br>\
In the Material Editor:<br>\
Add a Texture Sample node to bring in the displacement map.<br>\
Use a Tessellation mode (like PN Triangles) to enable geometry subdivision.<br>\
Add the displacement value from the texture to control how much displacement occurs.<br>\
Use a Material that applies tessellation and displacement:<br>\
Set the material to use Tessellation and plug the displacement map into the World Displacement node.<br>\
<br>\
Example Setup:<br>\
Create a new material.<br>\
Set the Material Domain to Surface and Shading Model to Default Lit.<br>\
Under the Tessellation section, select Tessellation Mode to PN Triangles or Flat Tessellation.<br>\
Use the Displacement node to control how much displacement is applied to the mesh.<br>\
Finally, plug in a Height Map into the World Displacement input.<br>\
<br>\
Considerations:<br>\
Performance Impact: Displacement is computationally expensive, especially when used with complex meshes. It can increase rendering times and affect performance, particularly on lower-end hardware.<br>\
Use Cases: Displacement is useful for high-detail surfaces, like terrain, rocks, wrinkles, and other organic shapes, where the geometry needs to change for realism."
},{
	title:"MOVABILITY"
	,en:"Why Mobility Matters:<br>\
Performance:<br>\
Static objects are the most optimized — they use Lightmass (pre-baked lighting).<br>\
Movable objects cost more performance because they require real-time lighting and shadows.<br>\
<br>\
Lighting:<br>\
Static actors receive and cast only baked shadows and light.<br>\
Stationary lights can have baked shadows for static objects, and dynamic shadows for movable ones.<br>\
Movable lights cast fully dynamic shadows, which are expensive but flexible.<br>\
<br>\
Gameplay Effects:<br>\
For things like characters, elevators, swinging lights, or destructible objects, you must use Movable.<br>\
For architecture or large set pieces that don't move, use Static or Stationary to save performance.<br>\
<br>\
Where to Set Mobility:<br>\
Select the Actor or Component in the viewport or World Outliner.<br>\
In the Details panel, find the Mobility dropdown (usually near the top).<br>\
Choose: Static Stationary Movable<br>\
<br>\
Best Practices:<br>\
Use Static wherever possible — it's the most optimized.<br>\
Use Stationary for light sources that may change intensity or color but don't move.<br>\
Use Movable only when absolutely necessary (e.g., characters, interactive objects).<br>\
Avoid making large complex meshes Movable unless required."
	,images:["movability-min"]
},
{
	title:"PUZZLES must be simple easy"
	,en:"Why Too Many Difficult Puzzles Can Be Problematic:<br>\
Breaks the Atmosphere:<br>\
In horror games, the atmosphere and immersion are often the primary sources of fear. Constantly stopping to solve difficult puzzles can break this flow, making the player focus more on mechanics than the tension or the horror around them. This can reduce the emotional impact of the game.<br>\
<br>\
Frustration Leads to Disconnect:<br>\
Frustration can easily lead to players disconnecting from the experience. When puzzles are too hard, players may feel like they are just working rather than enjoying the story or the fear. This can diminish the emotional investment in the game and lead to players quitting early or feeling disengaged.<br>\
<br>\
Too Much Focus on Problem-Solving:<br>\
If players are stuck on puzzles, they might lose track of the horror elements that make the game compelling in the first place. Instead of being scared or immersed, they're stressed over the mechanics, which doesn't align well with the horror genre.<br>\
<br>\
Unnecessary Complexity:<br>\
Complex puzzles can also make the game feel like it's artificially extended. This can cause players to feel like the horror experience is being dragged out unnecessarily. Horror games often rely on creating a tense, short burst of fear or unease — long, difficult puzzles can kill that pacing.<br>\
<br>\
Ideal Puzzle Design in Horror Games:<br>\
Keep Puzzles Relatively Simple:<br>\
Puzzles should enhance the story or the atmosphere, not overwhelm the player. It's okay to have a few challenging puzzles, but they should always feel rewarding and not like a roadblock to the horror experience.<br>\
<br>\
Use Puzzles to Build Tension, Not Frustration:<br>\
Instead of making puzzles complex for complexity's sake, design puzzles that fit naturally into the environment or story. For example, a puzzle that relates to the horrific elements of the game (e.g., unlocking a door in a creepy house) can enhance the sense of fear rather than pulling players out of it.<br>\
<br>\
Provide Clues:<br>\
If the puzzle is difficult, make sure there are environmental clues to help the player. Horror games often do well when players can discover things themselves, but it shouldn't be so obscure that players get frustrated.<br>\
<br>\
Consider Puzzle-Story Integration:<br>\
Design puzzles that tie directly into the narrative or environment, so players feel like they're solving something that's thematically important to the horror story. This makes the puzzle-solving feel like a natural progression in the experience, rather than an obstacle.<br>\
<br>\
Offer the Option to Skip:<br>\
For players who might get stuck, consider adding an optional 'skip puzzle' feature or an easy mode for puzzles. This ensures that players who are more interested in the story or atmosphere can still enjoy the game without being frustrated by difficult puzzles.<br>\
<br>\
Examples of Successful Puzzle Integration in Horror Games:<br>\
Amnesia: The Dark Descent:<br>\
The puzzles in Amnesia are integrated into the environment (e.g., finding keys, turning levers), and while they're not overly complex, they still add to the mystery and exploration without frustrating players.<br>\
<br>\
Layers of Fear:<br>\
Puzzles are often used to unlock new areas or reveal pieces of the story. The game balances puzzle-solving with environmental storytelling, so even if the puzzles are simple, they feel like a natural part of the journey.<br>\
<br>\
Silent Hill 2:<br>\
Silent Hill 2 has some puzzles, but they are intertwined with the atmosphere. The puzzles feel more like keys to unlocking parts of the terrifying world, and they're often easy to figure out once the player understands the clues.<br>\
<br>\
Final Thought:<br>\
In horror games, atmosphere and immersion are the most important elements. You want to ensure that puzzles enhance rather than detract from the horror experience. Keep them engaging but not overwhelming, and always allow players to focus on the tension, fear, and mystery that make horror games so gripping.<br>\
<br>\
If you're working on puzzles for your horror game, I'd suggest you focus on creating puzzles that are satisfying to solve but not overly punishing — let the fear come from the environment and story, not the frustration of getting stuck!"
},{
	title:"Sky Light"
	,en:"In UE, the Sky Light simulates ambient lighting by capturing light from the sky (either from a skybox or a real sky atmosphere) and applying it as indirect light to your scene. It fills in shadows and unlit areas, helping define form even where no direct light reaches.<br>\
<br>\
What does Sky Light do?<br>\
Adds soft, global ambient light to all surfaces.<br>\
Prevents completely black shadows.<br>\
Can work with Lumen, Lightmass, or Ray Tracing GI.<br>\
Can capture from a sky dome, Sky Atmosphere, or a cubemap.<br>\
<br>\
For horror games, should you use Sky Light?<br>\
You can use Sky Light — but use it carefully:<br>\
Reason to Use<br>\
Adds slight visibility in darkness<br>\
Helps define silhouettes in dark areas<br>\
Adds realism when combined with fog and bounce light<br>\
<br>\
When not to use or use with caution:<br>\
Don’t use strong Sky Light — it removes darkness and ruins horror atmosphere.<br>\
Don’t rely on it as your main light source.<br>\
Disable auto-capture if you want full manual control.<br>\
<br>\
Best practices for horror:<br>\
Set Sky Light intensity low (0.1–0.3).<br>\
Use Lumen + local lights (flashlight, candles, etc.) for tension and control.<br>\
Combine with Volumetric Fog, Post Process, and light blocking for strong mood."
},
{
	title:"Directional Light and Sky Light"
	,en:"In UE, Directional Light and Sky Light are two main types of lights commonly used to simulate environmental lighting, especially for outdoor scenes. However, depending on your scene and style, you can choose not to use them, but it's important to understand their roles:<br>\
<br>\
🔆 Directional Light<br>\
Simulates sunlight or a distant light source.<br>\
Creates sharp shadows, commonly used for daytime outdoor scenes.<br>\
Supports Dynamic Shadows, Cascaded Shadow Maps, and Light Shafts (god rays).<br>\
Can be set to Stationary, Movable, or Static depending on optimization and dynamic needs.<br>\
<br>\
🧠 Without Directional Light?<br>\
Your scene will have no main light source, unless replaced with something like a Spot or Point Light.<br>\
Not suitable for bright outdoor scenes.<br>\
Can work well for indoor or dark environments with artificial lighting.<br>\
<br>\
☁️ Sky Light<br>\
Captures light from the entire sky and evenly lights all objects, simulating ambient light.<br>\
Helps brighten areas that are not directly lit, like the shadowed sides of objects.<br>\
Can use an HDRI texture to simulate realistic skylight.<br>\
<br>\
🧠 Without Sky Light?<br>\
Indirect areas (in shadow) will be completely dark, losing detail.<br>\
The scene may look flat or lack depth with just a Directional Light.<br>\
<br>\
However, for horror or dark scenes, not having a Sky Light can make things feel gloomier and more intense — this can be an advantage.<br>\
<br>\
✅ In summary: Are they required?<br>\
Not required, but:<br>\
Use Directional Light if you need a strong sun-like source.<br>\
Use Sky Light to enhance overall brightness and shadow detail.<br>\
<br>\
In horror games, you can skip Sky Light to create deeper darkness and manually control lighting with Point/Spot Lights.<br>\
If you're working on a dark environment with a mix of indoor and outdoor areas, here's what I recommend regarding Directional Light and Sky Light:<br>\
<br>\
✅ Directional Light – Optional but Useful<br>\
If your outdoor areas have a moonlight or dim sun (e.g., sunset, overcast, or post-apocalyptic), you can still use a Directional Light but:<br>\
<br>\
Reduce its intensity.<br>\
Change its color to cool blue or orange hues.<br>\
Set it to Movable if you want dynamic shadows.<br>\
If you want full darkness outside (e.g., abandoned area at night), you can skip it entirely and use Spot/Point lights for full control.<br>\
<br>\
✅ Sky Light – Use Carefully<br>\
Sky Light can fill in shadow areas and give a subtle ambient boost, but in dark environments, it can flatten the mood if not tuned right.<br>\
<br>\
Tips:<br>\
Use a low-intensity Sky Light with a dark HDRI or cubemap.<br>\
Try real-time (movable) Sky Light if your scene changes.<br>\
Or disable it entirely and control lighting manually with smaller lights.<br>\
<br>\
✅ Alternative Strategy (For Horror/Atmosphere)<br>\
Rely more on:<br>\
<br>\
Point Lights for localized light sources (lamps, candles, etc.).<br>\
Spot Lights for flashlights, car headlights, etc.<br>\
Volumetric Fog, Light Shafts, and Post Process Volumes for mood.<br>\
Use darkness as part of gameplay (limiting vision, hiding danger)."
},
{
	title:"Exponential Height Fog"
	,en:"1. Tạo và bật Volumetric Fog:<br>\
Vào World Settings và tìm phần Default Settings.<br>\
Chọn Fog và bật Volumetric Fog.<br>\
Trong Lighting Settings, chắc chắn bạn đã bật Directional Light hoặc Sky Light nếu muốn ánh sáng có sự tương tác với sương mù.<br>\
<br>\
2. Thêm Exponential Height Fog vào scene:<br>\
Kéo Exponential Height Fog từ Palette vào trong World.<br>\
Bật Volumetric Fog trong các tùy chọn của Exponential Height Fog để kích hoạt hiệu ứng sương mù.<br>\
<br>\
3. Điều chỉnh các thông số quan trọng:<br>\
Fog Density: Điều chỉnh độ dày của sương mù. Tăng giá trị này sẽ làm cho sương mù dày đặc hơn.<br>\
Fog Falloff: Điều chỉnh độ lan tỏa của sương mù. Tăng giá trị này sẽ làm sương mù mờ dần từ mặt đất lên trên.<br>\
Start Distance: Đặt khoảng cách bắt đầu của sương mù từ camera.<br>\
Volumetric Scattering Intensity: Điều chỉnh cường độ ánh sáng khi đi qua sương mù.<br>\
Volumetric Fog Distance: Đặt phạm vi tối đa mà sương mù có thể ảnh hưởng.<br>\
<br>\
4. Điều chỉnh ánh sáng và sương mù tương tác:<br>\
Directional Light: Thêm một Directional Light và bật tính năng Volumetric Scattering trong thuộc tính của nó để ánh sáng có thể chiếu qua sương mù.<br>\
Sky Light: Nếu bạn sử dụng Sky Light, cũng có thể điều chỉnh độ sáng và tương tác với sương mù.<br>\
<br>\
Tùy chọn Unbound cho Volumetric Fog:<br>\
Giống như Post Process Volume, Volumetric Fog cũng có thể được sử dụng một cách toàn cục trong scene, không bị hạn chế trong một vùng nhất định.<br>\
Để làm cho Volumetric Fog ảnh hưởng trên toàn bộ cảnh, bạn cần bật Unbound.<br>\
<br>\
Unbound sẽ khiến Exponential Height Fog có tác dụng trên toàn bộ không gian, không bị giới hạn trong phạm vi của vùng mà nó được đặt. Điều này rất hữu ích khi bạn muốn có hiệu ứng sương mù phủ toàn bộ thế giới của game, không chỉ trong một khu vực nhỏ.<br>\
<br>\
Cách bật Unbound:<br>\
Trong Exponential Height Fog, tại mục Volumetric Fog hãy bật Unbound.<br>\
Điều này sẽ làm cho sương mù và ánh sáng volumetric không bị giới hạn ở phạm vi đặt Fog, mà sẽ áp dụng cho toàn bộ cảnh.<br>\
<br>\
Lưu ý khi sử dụng Volumetric Fog trong game kinh dị:<br>\
Kết hợp với ánh sáng yếu: Sương mù volumetric tạo hiệu ứng rất đẹp khi kết hợp với ánh sáng yếu, đặc biệt là ánh sáng từ đèn pin hoặc nguồn sáng nhỏ trong không gian tối.<br>\
Thử nghiệm với các màu sắc: Tạo cảm giác ma quái hoặc huyền bí bằng cách thay đổi màu sắc của sương mù (màu xám, nâu đỏ, hoặc xanh nhạt).<br>\
Tạo hiệu ứng ánh sáng đặc biệt: Bạn có thể thêm Spot Lights hoặc Point Lights vào scene để tạo ra ánh sáng chiếu qua sương mù, tạo ra những tia sáng kỳ ảo."
},{
	title:"Material Color Baking High poly"
	,en:"World space normal are not necessary for UE"
	,images:["mat_id00-min","mat_id01-min","mat_id02-min"]
},{
	title:"Lighting setup for a horror game in UE4"
	,en:"Here's a proper lighting setup for a horror game scene in UE 4, especially when you're working with mid-range hardware like a GTX 1660 Super. This setup focuses on atmosphere, tension, and performance optimization — ideal for horror.<br>\
<br>\
🎃 Horror Lighting Setup in UE4 (Optimized for Static/Stationary GI)<br>\
🔧 1. Project Settings<br>\
Go to Edit > Project Settings > Rendering:<br>\
<br>\
✅ Enable Ambient Occlusion<br>\
✅ Enable Use Static Lighting<br>\
🔲 Disable Ray Tracing<br>\
✅ Use Forward Shading (optional, but faster for low-spec)<br>\
✅ Set Auto Exposure to manual (see below)<br>\
<br>\
💡 2. Main Lighting Types to Use<br>\
[image]<br>\
<br>\
⚙️ 3. Basic Setup Steps<br>\
🌕 Moonlight / Outdoor Night Scene<br>\
Add a Directional Light, set it to:<br>\
<br>\
Intensity: 0.3–0.7<br>\
Light color: desaturated blue-gray<br>\
Cast Shadows: On<br>\
Mobility: Stationary<br>\
<br>\
Add a Sky Light, set to:<br>\
Source: Captured Scene or HDRI<br>\
Intensity: 0.2–0.4<br>\
Mobility: Stationary<br>\
<br>\
Add Exponential Height Fog:<br>\
Fog Density: 0.02–0.05<br>\
Fog Inscattering Color: bluish-gray<br>\
Add Volumetric Fog only if needed (costly)<br>\
<br>\
🏚️ Indoor Scene<br>\
Use Spot Lights to simulate flickering bulbs or flashlights.<br>\
Keep most areas in shadow or very dim — fear grows in what players can't see.<br>\
Try non-uniform lighting: light one corner, keep the rest dark.<br>\
Bake lighting using Build > Build Lighting Only for best performance.<br>\
<br>\
🎨 4. Post Process Volume Settings<br>\
Add a Post Process Volume and make it Unbound.<br>\
In settings:<br>\
Auto Exposure → Min/Max Brightness: Set both to 0.6 for stable exposure.<br>\
Color Grading:<br>\
Shadows: cooler tones (bluish)<br>\
Highlights: desaturated or warm (for contrast)<br>\
Vignette Intensity: 0.4+<br>\
Film Grain: 0.3–0.7<br>\
Bloom: subtle or off<br>\
Chromatic Aberration: 0.2 (optional for subtle distortion)<br>\
<br>\
⚠️ Tips<br>\
Avoid too many dynamic lights — keep most lights static or stationary.<br>\
Use light flicker blueprint for tension (can help if you want a scare).<br>\
Combine with sound design and camera shakes for extra fear impact."
	,images:["lighting_setup_for_a_horror_game_in_UE4-min","lighting_setup_for_a_horror_game_in_UE4_01-min"]
},{
	title:"Creating torn papers lying on the ground"
	,en:"For creating torn papers lying on the ground in UE, there are a couple of approaches you could take, depending on the level of detail and performance you aim for:<br>\
<br>\
Decals:<br>\
Pros: Simple to implement, no need to model geometry, and can add detail to the surface easily. This approach works best for flat, 2D-like torn paper textures on the ground.<br>\
Cons: It won't give you the physical thickness or realistic depth of torn paper. It's more suitable for stylized or simple effects.<br>\
Use this if you want something quick and lightweight, with minimal impact on performance.<br>\
<br>\
Model Mesh with Torn Paper Shape:<br>\
Pros: This will give you actual 3D geometry, making it more flexible and realistic for close-up shots. You can model the torn paper shape in 3D and add textures with normal maps or displacement to enhance the appearance.<br>\
Cons: Slightly more complex, requires more polygons than a simple decal, and may affect performance if you use many pieces of torn paper.<br>\
Go with this if you need more realistic or dynamic torn papers, especially for scenes where the camera will get closer to the paper.<br>\
<br>\
Rectangle Plane with Opacity Mask:<br>\
Pros: Using a rectangle plane with an opacity mask allows you to control the torn edges with a texture. It’s lightweight and can look good if you want to keep the paper flat and not overly detailed.<br>\
Cons: It might look flat if viewed from certain angles, and you’ll still need to create or source an appropriate opacity mask texture.<br>\
This is a good balance between simplicity and realism, particularly if you want some depth but don’t need complex geometry.<br>\
<br>\
Suggestion:<br>\
If the torn paper will be seen from a distance or if you’re focusing on performance, decals or rectangle planes with opacity masks should be sufficient. If the paper will be in the foreground or close to the camera, then modeling the torn paper mesh would be better for realism."
},{
	title:"TRIS"
	,en:"In UE 4.27, the number of triangles suitable for imported objects depends on the type of asset and its use in-game. Here's a general guideline:<br>\
<br>\
⚠️ Important Considerations:<br>\
LOD (Level of Detail) is expected. Use multiple LODs for high-poly models.<br>\
Target platform matters:<br>\
PC/Console: Higher poly is fine.<br>\
Mobile/VR: Keep assets much lower (≤ 10K for characters).<br>\
Draw calls and materials often have a bigger impact than triangles alone.<br>\
<br>\
✔ Best Practices:<br>\
Keep most assets under 50,000 triangles per object.<br>\
Always generate collision and LODs.<br>\
Optimize skeletal meshes more aggressively than static props."
	,images:["max_tris-min"]
},{
	title:"Build environment 1"
	,en:"1. Dùng Modular Kit<br>\
Thay vì dựng từng bức tường hay cột riêng lẻ, bạn nên tạo các modular pieces (các mảnh lặp lại):<br>\
<br>\
Loại Module	Kích thước gợi ý<br>\
Wall/Floor		400cm x 400cm<br>\
Door Frame		100cm x 250cm<br>\
Window			100cm x 100cm<br>\
<br>\
➡️ Sau đó, ráp như lego trong Unreal → nhanh, gọn, chỉnh sửa dễ.<br>\
<br>\
🧱 2. Trim Sheet thay vì từng texture riêng<br>\
Như bạn đang làm: trim sheet là tuyệt vời cho solo dev.<br>\
Chỉ cần 1 texture 1K bạn có thể dùng cho 10+ vật thể khác nhau.<br>\
Gắn UV chính xác vào dải trim → tiết kiệm RAM, dễ làm vật thể mới.<br>\
<br>\
🧩 3. Sử dụng Blueprints để tạo cụm (cluster)<br>\
Dựng từng mesh = chậm và khó kiểm soát.<br>\
<br>\
➡️ Hãy dùng Blueprint Actor để nhóm:<br>\
Một cụm bàn + ghế + đèn<br>\
Một đoạn hành lang có 2 cửa + đèn<br>\
→ Kéo thả một lần, chỉnh sửa một chỗ, tiết kiệm hàng giờ.<br>\
<br>\
🛠️ 4. Làm blockout trước<br>\
Đừng vội dựng chi tiết. Dùng boxes đơn giản hoặc shape từ Unreal để dựng layout tổng thể:<br>\
Cửa ở đâu?<br>\
Góc camera nào quan trọng?<br>\
Di chuyển như thế nào?<br>\
<br>\
→ Sau khi chắc chắn layout ổn, mới bắt đầu thay từng box bằng mesh chi tiết.<br>\
<br>\
💡 5. Làm theo tầng (pass-based workflow)<br>\
Blockout (layout, scale)<br>\
Modular replacement (thay box bằng mesh)<br>\
Lighting sơ bộ<br>\
Detail pass (đồ đạc, decals)<br>\
Atmosphere (fog, light FX, sound)<br>\
<br>\
→ Mỗi bước đều rõ ràng, tránh bị sa lầy vào chi tiết quá sớm."
},{
	title:"Build environment 2 - Use a big plane for floor/ground tile"
	,en:"🔶 Dùng 1 tấm plane lớn (ví dụ: 4000x4000 cm)<br>\<br>\
✅ Ưu điểm:<br>\<br>\
Rất nhanh: chỉ cần đặt một mesh là xong sàn.<br>\<br>\
Không có khe hở giữa các modular pieces.<br>\<br>\
Dễ UV mapping nếu dùng một texture tile đơn giản (dễ cho blockout giai đoạn đầu).<br>\<br>\
<br>\<br>\
❌ Nhược điểm:<br>\<br>\
Không linh hoạt: khó chỉnh layout sau này.<br>\<br>\
<br>\<br>\
Nếu có chi tiết hỏng hóc, vết máu, rêu… → khó blend đúng vị trí (trừ khi dùng decals).<br>\<br>\
Không cắt được lightmap hợp lý, gây lỗi đổ bóng (light bleed, shadow noise).<br>\<br>\
Tấm lớn quá → mất batching, Unreal khó tối ưu khi tính toán draw calls.<br>\<br>\
<br>\<br>\
🔷 Dùng nhiều modular floor plane nhỏ (ví dụ: 400x400 cm)<br>\<br>\
✅ Ưu điểm:<br>\<br>\
Linh hoạt: dễ thay đổi layout, copy-paste, gắn blueprint, cắt phần nào cũng được.<br>\<br>\
Tốt hơn cho vertex paint, decals, damage blending.<br>\<br>\
Tối ưu tốt hơn về occlusion culling và LOD (vì từng mảnh riêng).<br>\<br>\
Nếu dùng trim sheet, UV rất dễ căn vào đúng khu vực.<br>\<br>\
<br>\<br>\
❌ Nhược điểm:<br>\<br>\
Tốn nhiều thao tác đặt hơn (nhưng có thể dùng script hoặc blueprint để ráp nhanh).<br>\<br>\
Có thể bị lỗi khe hở nếu modular mesh không khớp 100% hoặc có floating point error.<br>\<br>\
<br>\<br>\
🧠 Kết luận:<br>\<br>\
Trường hợp	Nên dùng<br>\<br>\
Prototype, blockout, cảnh đơn giản	Plane lớn<br>\<br>\
Cảnh game thật, cần detail, tối ưu	Modular nhỏ<br>\<br>\
Cảnh cinematic, không di chuyển	Plane lớn có thể chấp nhận được<br>\<br>\
<br>\<br>\
Nếu bạn chỉ định làm cảnh 'một lần rồi thôi', thì tấm lớn có thể chấp nhận được. Nhưng nếu:<br>\<br>\
<br>\<br>\
Người chơi có thể di chuyển nhiều<br>\<br>\
Cảnh có tương tác, phá hủy, máu, decal<br>\<br>\
Bạn định reuse (dùng lại) mesh ở nơi khác<br>\<br>\
<br>\<br>\
→ Thì nên dùng modular, dù hơi tốn công lúc đầu."
},{
	title:"TRIM SHEET BÀN – GHẾ - TỦ – ĐÈN"
	,en:"Dùng chỉ 1 texture 1024x1024<br>\
Chứa đủ các loại vật liệu: gỗ, kim loại, vải nệm, bóng đèn<br>\
UV dễ gán bằng tay (có khoảng cách rõ ràng)<br>\
Có thể tile hoặc reuse được"
	,images:["trimsheet1k-ban-ghe-den"]
}



















]