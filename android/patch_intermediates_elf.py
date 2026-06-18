import os
import struct

def patch_elf_alignment(file_path, new_align=0x4000):
    with open(file_path, "r+b") as f:
        data = f.read(0x40)
        magic = data[0:4]
        if magic != b'\x7fELF':
            return False

        is_64 = (data[4] == 2)
        if is_64:
            e_phoff = struct.unpack("<Q", data[0x20:0x28])[0]
            e_phentsize = struct.unpack("<H", data[0x36:0x38])[0]
            e_phnum = struct.unpack("<H", data[0x38:0x3a])[0]
            align_offset_in_phdr = 0x30 # p_align is at offset 0x30 in Elf64_Phdr
        else:
            e_phoff = struct.unpack("<I", data[0x1c:0x20])[0]
            e_phentsize = struct.unpack("<H", data[0x2a:0x2c])[0]
            e_phnum = struct.unpack("<H", data[0x2c:0x2e])[0]
            align_offset_in_phdr = 0x24 # p_align is at offset 0x24 in Elf32_Phdr

        patched_any = False
        for i in range(e_phnum):
            ph_offset = e_phoff + (i * e_phentsize)
            f.seek(ph_offset)
            phdr = f.read(e_phentsize)
            p_type = struct.unpack("<I", phdr[0:4])[0]
            if p_type == 1: # PT_LOAD
                f.seek(ph_offset + align_offset_in_phdr)
                f.write(struct.pack("<Q" if is_64 else "<I", new_align))
                patched_any = True
        return patched_any

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    search_dir = os.path.join(script_dir, "app", "build", "intermediates")
    
    if not os.path.exists(search_dir):
        print(f"Directory not found: {search_dir}")
        return
        
    print(f"Scanning for .so files in: {search_dir}")
    patched_count = 0
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file.endswith(".so"):
                full_path = os.path.join(root, file)
                try:
                    success = patch_elf_alignment(full_path)
                    if success:
                        patched_count += 1
                except Exception as e:
                    print(f"Error patching {file}: {e}")
    print(f"Patched {patched_count} shared libraries for 16KB alignment.")

if __name__ == "__main__":
    main()
