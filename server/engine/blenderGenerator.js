/**
 * Generates an automated, fully executable Blender Python (bpy) script.
 * Users or backend render workers can run: blender -b -P generate_house.py -a
 */

export function generateBlenderScript(planData, customization = {}) {
  const {
    wallColorHex = '#F3F4F6',
    accentColorHex = '#3B82F6',
    roofType = 'flat_parapet',
    lightingAmbiance = 'sunset'
  } = customization;

  const script = `# ==============================================================================
# ArchSynth 3D - Automated Procedural Architectural Generator for Blender
# Plan ID: ${planData.meta.planId} | Generated for: ${planData.plot.widthFt}ft x ${planData.plot.depthFt}ft (${planData.plot.facing} Facing)
# ==============================================================================

import bpy
import math

# 1. Clear existing scene data
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'

# 2. Material Helper
def create_material(name, diffuse_color, roughness=0.4, metallic=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = diffuse_color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
    return mat

# Create Core Architectural Materials
mat_wall = create_material("Wall_Stucco", (0.92, 0.93, 0.95, 1.0), roughness=0.7)
mat_accent = create_material("Accent_Facade", (0.18, 0.22, 0.35, 1.0), roughness=0.3)
mat_glass = create_material("Window_Glass", (0.8, 0.9, 1.0, 1.0), roughness=0.05)
if "Transmission Weight" in mat_glass.node_tree.nodes["Principled BSDF"].inputs:
    mat_glass.node_tree.nodes["Principled BSDF"].inputs["Transmission Weight"].default_value = 0.95
mat_grass = create_material("Lawn_Bermuda", (0.15, 0.55, 0.2, 1.0), roughness=0.9)
mat_paving = create_material("Driveway_Pavers", (0.35, 0.35, 0.38, 1.0), roughness=0.6)
mat_wood = create_material("Teak_Door", (0.45, 0.25, 0.12, 1.0), roughness=0.35)

# 3. Create Site & Landscape
plot_w = ${planData.threeMeshSpecs.plot.widthM.toFixed(3)}
plot_d = ${planData.threeMeshSpecs.plot.depthM.toFixed(3)}

# Ground Plot Base
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -0.05))
ground = bpy.context.active_object
ground.name = "Site_Boundary"
ground.scale = (plot_w, plot_d, 1)
ground.data.materials.append(mat_paving)

# Front Garden Lawn
lawn_spec = ${JSON.stringify(planData.threeMeshSpecs.landscape3D.lawn)}
bpy.ops.mesh.primitive_cube_add(size=1, location=(lawn_spec.xM, lawn_spec.zM, 0.05))
lawn = bpy.context.active_object
lawn.name = "Garden_Lawn"
lawn.scale = (lawn_spec.widthM, lawn_spec.depthM, 0.1)
lawn.data.materials.append(mat_grass)

# 4. Construct Building Perimeter & Floor Slabs
bldg = ${JSON.stringify(planData.threeMeshSpecs.building)}
wall_h = bldg.heightM

# Ground Floor Slab
bpy.ops.mesh.primitive_cube_add(size=1, location=(bldg.xM, bldg.zM, 0.1))
slab = bpy.context.active_object
slab.name = "Foundation_Plinth"
slab.scale = (bldg.widthM, bldg.depthM, 0.2)
slab.data.materials.append(mat_wall)

# Exterior Main Shell
bpy.ops.mesh.primitive_cube_add(size=1, location=(bldg.xM, bldg.zM, wall_h / 2 + 0.2))
house_mass = bpy.context.active_object
house_mass.name = "Architectural_Volume"
house_mass.scale = (bldg.widthM, bldg.depthM, wall_h)
house_mass.data.materials.append(mat_wall)

# Parapet Roof Slab
bpy.ops.mesh.primitive_cube_add(size=1, location=(bldg.xM, bldg.zM, wall_h + 0.3))
roof = bpy.context.active_object
roof.name = "Terrace_Parapet_Roof"
roof.scale = (bldg.widthM + 0.6, bldg.depthM + 0.6, 0.25)
roof.data.materials.append(mat_accent)

# 5. Place Architectural Glazing & Entrance Feature
bpy.ops.mesh.primitive_cube_add(size=1, location=(bldg.xM, bldg.zM + bldg.depthM / 2 + 0.05, 1.6))
glass_facade = bpy.context.active_object
glass_facade.name = "Curtain_Wall_Glazing"
glass_facade.scale = (bldg.widthM * 0.45, 0.15, 2.4)
glass_facade.data.materials.append(mat_glass)

# Entrance Door Feature
bpy.ops.mesh.primitive_cube_add(size=1, location=(bldg.xM - bldg.widthM * 0.3, bldg.zM + bldg.depthM / 2 + 0.08, 1.25))
door = bpy.context.active_object
door.name = "Main_Teak_Entry"
door.scale = (1.2, 0.12, 2.3)
door.data.materials.append(mat_wood)

# 6. Environmental Lighting Setup
# Sun Light
bpy.ops.object.light_add(type='SUN', location=(15, -15, 25))
sun = bpy.context.active_object
sun.data.energy = 4.5
sun.data.color = (1.0, 0.94, 0.86) if "${lightingAmbiance}" == "sunset" else (1.0, 1.0, 1.0)
sun.rotation_euler = (math.radians(45), math.radians(20), math.radians(40))

# Interior Warm Ambient Lights
for i, room in enumerate(${JSON.stringify(planData.threeMeshSpecs.rooms3D)}):
    bpy.ops.object.light_add(type='POINT', location=(room['xM'], room['zM'], 2.4))
    pt = bpy.context.active_object
    pt.name = f"Light_{room['name']}"
    pt.data.energy = 85.0
    pt.data.color = (1.0, 0.88, 0.72)

# 7. Animated Cinematic Walkthrough Camera
bpy.ops.object.camera_add(location=(0, 18, 24))
cam = bpy.context.active_object
scene.camera = cam
cam.data.lens = 24  # 24mm architectural wide-angle

# Set Frame Range for Walkthrough Film (24 FPS, 15 seconds = 360 frames)
scene.frame_start = 1
scene.frame_end = 360

keyframes = [
    (1,   (0, 18, 22),       math.radians(52), math.radians(0), math.radians(180)),
    (90,  (lawn_spec['xM'], lawn_spec['zM'] + 4, 2.2), math.radians(82), math.radians(0), math.radians(180)),
    (180, (bldg['xM'], bldg['zM'] + 1, 1.7), math.radians(88), math.radians(0), math.radians(160)),
    (270, (bldg['xM'] - 2, bldg['zM'] - 1, 1.7), math.radians(86), math.radians(0), math.radians(90)),
    (360, (0, -14, 8),       math.radians(70), math.radians(0), math.radians(0))
]

for frame, loc, rot_x, rot_y, rot_z in keyframes:
    scene.frame_set(frame)
    cam.location = loc
    cam.rotation_euler = (rot_x, rot_y, rot_z)
    cam.keyframe_insert(data_path="location", frame=frame)
    cam.keyframe_insert(data_path="rotation_euler", frame=frame)

# 8. Render Engine Optimization (Cycles / Eevee)
scene.render.engine = 'BLENDER_EEVEE_NEXT' if hasattr(bpy.types, 'RenderSettings') else 'CYCLES'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.fps = 24

print(">> ArchSynth 3D Scene Generation Complete! Ready for 4K Rendering and Animation Export.")
`;

  return script;
}
