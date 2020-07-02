using System;
using System.IO;

namespace Blazor.FileReader
{
    /// <summary>
    /// Provides information on the position of a Stream currently reading this file.
    /// </summary>
    public interface IFilePositionInfo
    {
        /// <summary>
        /// The current position of a Stream currently reading this file.
        /// </summary>
        long Position { get; }

        /// <summary>
        /// The value of <see cref="Position"/> when <see cref="Acknowledge"/> was last called
        /// </summary>
        long PositionOnAcknowledge { get; }

        /// <summary>
        /// The delta between current <see cref="Position"/> and what the value was at the last call to <see cref="Acknowledge"/>
        /// </summary>
        long PositionDeltaSinceAcknowledge { get; }

        /// <summary>
        /// The current position of a Stream currently reading this file, relative to the file size.
        /// </summary>
        decimal Percentage { get; }

        /// <summary>
        /// The value of <see cref="Percentage"/> when <see cref="Acknowledge"/> was last called
        /// </summary>
        decimal PercentageOnAcknowledge { get; }

        /// <summary>
        /// The delta between current <see cref="Percentage"/> and <see cref="PercentageOnAcknowledge"/>
        /// </summary>
        decimal PercentageDeltaSinceAcknowledge { get; }

        /// <summary>
        /// The underlying stream that was the source of the <see cref="Position"/> change.
        /// </summary>
        object DataStream { get; }

        /// <summary>
        /// Saves value of <see cref="Position"/> to <see cref="PositionOnAcknowledge"/>
        /// and <see cref="Percentage"/> to <see cref="PercentageOnAcknowledge"/>
        /// </summary>
        /// <remarks>
        /// The saved values may also be comsumed as deltas from convenience
        /// properties <see cref="PositionDeltaSinceAcknowledge"/> and <see cref="PercentageDeltaSinceAcknowledge"/>
        /// </remarks>
        void Acknowledge();

        /// <summary>
        /// Called after <see cref="Position"/> has changed.
        /// </summary>
        event EventHandler<IFilePositionInfo> PositionChanged;
    }

    internal class FilePositionInfo : IFilePositionInfo
    {
        private long position;
        private Lazy<decimal> percentage;
        private Lazy<decimal> percentageOnAcknowledge;

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

        internal long FileSize { get; set; }

        public long PositionOnAcknowledge { get; private set; }

        public object DataStream { get; private set; }

        public long PositionDeltaSinceAcknowledge => Math.Abs(Position - PositionOnAcknowledge);

        public decimal Percentage => percentage?.Value ?? 0;

        public decimal PercentageOnAcknowledge => percentageOnAcknowledge?.Value ?? 0;

        public decimal PercentageDeltaSinceAcknowledge => Math.Abs(Percentage - PercentageOnAcknowledge);

        public event EventHandler<IFilePositionInfo> PositionChanged;

        public void Acknowledge()
        {
            PositionOnAcknowledge = Position;
            percentageOnAcknowledge = new Lazy<decimal>(() => this.FileSize == 0 ? 0 : (PositionOnAcknowledge * 100m / this.FileSize));
        }

        internal void Update(object dataStream, long position)
        {
            DataStream = dataStream;
            percentage = new Lazy<decimal>(() => this.FileSize == 0 ? 0: (position * 100m / this.FileSize));
            Position = position;
        }
    }
}
