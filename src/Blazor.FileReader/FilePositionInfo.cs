using System;

namespace Blazor.FileReader
{
    public interface IFilePositionInfo
    {
        long Position { get; }

        long PositionOnAcknowledge { get; }

        long PositionDeltaOnAcknowledge { get; }

        decimal Percentage { get; }

        decimal PercentageOnAcknowledge { get; }

        decimal PercentageDeltaOnAcknowledge { get; }

        object DataStream { get; }

        void Acknowledge();

        event EventHandler<IFilePositionInfo> PositionChanged;
    }

    internal class FilePositionInfo : IFilePositionInfo
    {
        private long position;
        private Lazy<decimal> percentage;
        private Lazy<decimal> percentageOnAcknowledge;
        private long fileSizeOnAcknowledge;
        private long fileSize;

        public long Position {
            get => position;
            private set {
                var oldValue = position;
                
                position = value;
                if (position != oldValue)
                {
                    PositionChanged?.Invoke(this, this);
                }
            }
        }

        public long PositionOnAcknowledge { get; private set; }

        public object DataStream { get; private set; }

        public long PositionDeltaOnAcknowledge => Math.Abs(Position - PositionOnAcknowledge);

        public decimal Percentage => percentage.Value;

        public decimal PercentageOnAcknowledge => percentageOnAcknowledge.Value;

        public decimal PercentageDeltaOnAcknowledge => Math.Abs(Percentage - PercentageOnAcknowledge);

        public event EventHandler<IFilePositionInfo> PositionChanged;

        public void Acknowledge()
        {
            PositionOnAcknowledge = Position;
            fileSizeOnAcknowledge = fileSize;
        }

        internal void Update(object dataStream, long position, long fileSize)
        {
            this.fileSize = fileSize;
            DataStream = dataStream;
            percentage = new Lazy<decimal>(() => fileSize==0 ? 0: ((decimal)position / fileSize));
            percentageOnAcknowledge = new Lazy<decimal>(() => fileSizeOnAcknowledge==0 ? 0: ((decimal)PositionOnAcknowledge / fileSizeOnAcknowledge));
            Position = position;
        }
    }
}
