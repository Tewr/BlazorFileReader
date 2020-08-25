using NUnit.Framework;
using System;
using System.IO;
using Tewr.Blazor.FileReader;

namespace Blazor.FileReader.UnitTests
{
    public class InteropStreamTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void CanSeekInLargeFilesFromBegin()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(size - 1, SeekOrigin.Begin);

            // Then
            Assert.AreEqual(pos, stream.Position);
            Assert.AreEqual(stream.Position, size-1);
        }

        [Test]
        public void CanSeekInLargeFilesFromEnd()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(-1, SeekOrigin.End);

            // Then
            Assert.AreEqual(pos, stream.Position);
            Assert.AreEqual(stream.Position, stream.Length-1);
        }

        [Test]
        public void CanSeekInLargeFilesFromCurrent()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(1, SeekOrigin.Current);

            // Then
            Assert.AreEqual(pos, stream.Position);
            Assert.AreEqual(stream.Position, 1);
        }

        [Test]
        public void CanSeekInLargeFilesFromEndAfterEndOFFile()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            var pos = stream.Seek(1, SeekOrigin.End);

            // Then
            Assert.AreEqual(pos, stream.Position);
            Assert.AreEqual(stream.Position, stream.Length+1);
        }

        [Test]
        public void CanSeekInLargeFilesFromCurrentWithPosition()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When
            stream.Position = 5;
            var pos = stream.Seek(1, SeekOrigin.Current);

            // Then
            Assert.AreEqual(pos, stream.Position);
            Assert.AreEqual(stream.Position, 5 + 1);
        }

        [Test]
        public void CannotSeekBeforeBegin()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / Then
            Assert.Throws<IOException>(() => stream.Seek(-1, SeekOrigin.Begin));
        }

        [Test]
        public void CannotSeekBeforeUsingEnd()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / then
            Assert.Throws<IOException>(() => stream.Seek(-(size + 1), SeekOrigin.End));
        }

        [Test]
        public void CannotSeekBeforeFromCurrent()
        {
            // Given
            var size = int.MaxValue * 2L;
            var stream = new FileReaderJsInterop.InteropFileStream(0, new Tewr.Blazor.FileReader.FileInfo { Size = size }, null);

            // When / then
            Assert.Throws<IOException>(() => stream.Seek(-1, SeekOrigin.Current));
        }
    }
}