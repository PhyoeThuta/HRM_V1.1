import colorsys

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def reverse_filter(hex_color):
    r, g, b = hex_to_rgb(hex_color)
    r, g, b = r/255.0, g/255.0, b/255.0
    
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h = (h - 0.5) % 1.0  
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    
    r = 1.0 - r
    g = 1.0 - g
    b = 1.0 - b
    
    return f"{int(r*255)} {int(g*255)} {int(b*255)}"

targets_light = {
    '400': '#b3c64c',
    '500': '#A3B81F',
    '600': '#829319',
    '700': '#626e13'
}

targets_dark = {
    '400': '#818cf8',
    '500': '#6366f1',
    '600': '#4f46e5',
    '700': '#4338ca'
}

print("/* DARK MODE RGB */")
for shade, hex_val in targets_dark.items():
    r, g, b = hex_to_rgb(hex_val)
    print(f"--color-brand-{shade}: {r} {g} {b};")

print("\n/* LIGHT MODE RGB (Pre-inverted) */")
for shade, hex_val in targets_light.items():
    print(f"--color-brand-{shade}: {reverse_filter(hex_val)};")
