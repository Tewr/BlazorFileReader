using System.Runtime.InteropServices;

namespace Blazor.FileReader
{
    
    [StructLayout(LayoutKind.Explicit)]
    struct ReadFileParams
    {
        [FieldOffset(0)]
        public byte[] Buffer;
        [FieldOffset(4)]
        internal long BufferOffset;
        [FieldOffset(12)]
        internal int Count;
        [FieldOffset(16)]
        internal int FileRef;
        [FieldOffset(20)]
        public long Position;
    }

}
