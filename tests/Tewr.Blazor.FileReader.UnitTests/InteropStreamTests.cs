using System;
using System.IO;
using Xunit;

namespace Tewr.Blazor.FileReader.UnitTests
{
    public class InteropStreamTests
    {

        [Fact]
        public void CanSeekInLargeFilesFromBegin()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(size - 1, SeekOrigin.Begin);

            // Then
            Assert.Equal(pos, stream.Position);
            Assert.Equal(stream.Position, size-1);
        }

        [Fact]
        public void CanSeekInLargeFilesFromEnd()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(-1, SeekOrigin.End);

            // Then
            Assert.Equal(pos, stream.Position);
            Assert.Equal(stream.Position, stream.Length-1);
        }

        [Fact]
        public void CanSeekInLargeFilesFromCurrent()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(1, SeekOrigin.Current);

            // Then
            Assert.Equal(pos, stream.Position);
            Assert.Equal(1, stream.Position);
        }

        [Fact]
        public void CanSeekInLargeFilesFromEndAfterEndOFFile()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(1, SeekOrigin.End);

            // Then
            Assert.Equal(pos, stream.Position);
            Assert.Equal(stream.Length + 1, stream.Position);
        }

        [Fact]
        public void CanSeekInLargeFilesFromCurrentWithPosition()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            stream.Position = 5;
            var pos = stream.Seek(1, SeekOrigin.Current);

            // Then
            Assert.Equal(pos, stream.Position);
            Assert.Equal(stream.Position, 5 + 1);
        }

        [Fact]
        public void CannotSeekBeforeBegin()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / Then
            Assert.Throws<IOException>(() => stream.Seek(-1, SeekOrigin.Begin));
        }

        [Fact]
        public void CannotSeekBeforeUsingEnd()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / then
            Assert.Throws<IOException>(() => stream.Seek(-(size + 1), SeekOrigin.End));
        }

        [Fact]
        public void CannotSeekBeforeFromCurrent()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / then
            Assert.Throws<IOException>(() => stream.Seek(-1, SeekOrigin.Current));
        }

        [Fact]
        public void CannotSeekUsingUnknownOrigin()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);
            // When / then
            Assert.Throws<ArgumentException>(() => stream.Seek(2, (SeekOrigin)55));
        }
    }
}