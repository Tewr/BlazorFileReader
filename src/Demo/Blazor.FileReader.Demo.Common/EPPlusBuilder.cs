﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;

namespace Blazor.FileReader.Demo.Common
{
    public class EPPlusBuilder
    {
        static EPPlusBuilder()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        public static TablesModel Parse(ExcelPackage xlPackage, bool treatFirstRowAsHeader)
        {
            var tableModel = new TablesModel();
            var workbook = xlPackage.Workbook;
            if (workbook != null)
            {
                foreach (var worksheet in workbook.Worksheets)
                {
                    var table = tableModel.Add();
                    table.Name = worksheet.Name;
                    if (worksheet.Dimension == null)
                    {
                        continue;
                    }
                    var rowCount = 0;
                    var firstIteration = rowCount;
                    var maxColumnNumber = worksheet.Dimension.End.Column;
                    var rows = worksheet.Cells.ToLookup(c => c.Start.Row);
                    var tableRows = Enumerable.Range(1, rows.Max(x => x.Key));
                    var worksheet1 = worksheet;
                    foreach (var rowNumber in tableRows)
                    {

                        var isFirstRow = rowCount == firstIteration;
                        rowCount++;
                        var rowModel = new TablesModel.RowModel();
                        if (isFirstRow && treatFirstRowAsHeader)
                        {
                            table.Header = rowModel;
                        }
                        else
                        {
                            table.Body.Add(rowModel);
                        }
                        var row = rows[rowNumber];
                        if (!row.Any())
                        {
                            for (var i = 0; i < maxColumnNumber; i++)
                            {
                                rowModel.AddCell();
                            }
                            continue;
                        }
                        var cells = row.OrderBy(cell => cell.Start.Column).ToList();
                        rowModel.Height = worksheet1.Row(rowCount).Height;
                        for (var i = 1; i <= maxColumnNumber; i++)
                        {
                            var cell = rowModel.AddCell();
                            var currentCell = cells.SingleOrDefault(c => c.Start.Column == i);
                            if (currentCell == null)
                            {
                                continue;
                            }
                            var colSpan = 1;
                            var rowSpan = 1;

                            var cellAddress = new ExcelAddress(currentCell.Address);

                            var mCellsResult = worksheet1.MergedCells
                                .Select(mCell => new { c = mCell, addr = new ExcelAddress(mCell) })
                                .Where(mCell =>
                                    cellAddress.Start.Row >= mCell.addr.Start.Row &&
                                    cellAddress.End.Row <= mCell.addr.End.Row &&
                                    cellAddress.Start.Column >= mCell.addr.Start.Column &&
                                    cellAddress.End.Column <= mCell.addr.End.Column)
                                .Select(mCell => mCell.addr).ToList();

                            if (mCellsResult.Any())
                            {
                                var mCells = mCellsResult.First();

                                //if the cell and the merged cell do not share a common start address then skip this cell as it's already been covered by a previous item
                                if (mCells.Start.Address != cellAddress.Start.Address)
                                    continue;

                                if (mCells.Start.Column != mCells.End.Column)
                                {
                                    colSpan += mCells.End.Column - mCells.Start.Column;
                                }

                                if (mCells.Start.Row != mCells.End.Row)
                                {
                                    rowSpan += mCells.End.Row - mCells.Start.Row;
                                }
                            }


                            cell.Colspan = colSpan;
                            cell.Rowspan = rowSpan;

                            cell.Value = currentCell.Value.ToString();
                        }
                    }
                }
            }

            return tableModel;
        }

        public class TablesModel
        {
            public IList<TableModel> Tables { get; set; } = new List<TableModel>();

            public TableModel Add()
            {
                var tableModel = new TableModel();
                Tables.Add(tableModel);
                return tableModel;
            }
            public class TableModel
            {
                public RowModel Header { get; set; }
                public IList<RowModel> Body { get; set; } = new List<RowModel>();
                public string Name { get; set; }
            }

            public class RowModel
            {

                public IList<CellModel> Cells { get; set; } = new List<CellModel>();
                public double Height { get; set; }

                public CellModel AddCell()
                {
                    var cell = new CellModel();
                    Cells.Add(cell);
                    return cell;
                }
            }

            public class CellModel
            {
                public string Value { get; set; } = string.Empty;
                public int Colspan { get; set; } = 1;
                public int Rowspan { get; set; } = 1;
            }

        }

    }
}
