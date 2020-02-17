using System.Runtime.InteropServices;

namespace Blazor.FileReader
{
    
    [StructLayout(LayoutKind.Explicit)]
    struct ReadFileParams
    {   
        [FieldOffset(0)]
        internal long BufferOffset;
        [FieldOffset(8)]
        internal int Count;
        [FieldOffset(12)]
        internal int FileRef;
        [FieldOffset(16)]
        public long Position;
        [FieldOffset(24)]
        public byte[] Buffer;
    }

}
