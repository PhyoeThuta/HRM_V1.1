import colorsys

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def reverse_filter(hex_color):
    r, g, b = hex_to_rgb(hex_color)
    r, g, b = r/255.0, g/255.0, b/255.0
    
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h = (h - 0.5) % 1.0  
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    
    r = 1.0 - r
    g = 1.0 - g
    b = 1.0 - b
    
    return rgb_to_hex((r*255, g*255, b*255))

targets = {
    '400': '#b3c64c',
    '500': '#A3B81F',
    '600': '#829319',
    '700': '#626e13'
}

for shade, hex_val in targets.items():
    print(f"--color-brand-{shade}: {reverse_filter(hex_val).upper()}; /* Target {shade}: {hex_val} */")
