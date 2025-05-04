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
	,en:"In Unreal Engine, the Sky Light simulates ambient lighting by capturing light from the sky (either from a skybox or a real sky atmosphere) and applying it as indirect light to your scene. It fills in shadows and unlit areas, helping define form even where no direct light reaches.<br>\
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
}


















]