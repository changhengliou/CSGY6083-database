const Table = ({ className, columns, data, rowKey, ...props }) => {
  return (
    <table
      className={`table table-light table-striped table-bordered table-hover table-responsive rounded ${className || ''}`}
      {...props}
    >
      <thead>
        <tr>
          {
            // [{label: '', key: ''}]
            (columns || []).map((col, index) => {
              return (
                <th key={`${col.key}_${index}_${Math.random().toString(36).substr(4)}`}>{col.label}</th>
              );
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          !data || !data.length ? (
            <tr className="p-3">
              <td colSpan={(columns || []).length} className="text-center">No data</td>
            </tr>
          ) : (
            (data || []).map((row, index) => {
              return (
                <tr key={`${row[rowKey]}_${index}`}>
                  {
                    columns.map(col => {
                      if (col.element) {
                        const Component = col.element.type;
                        return (
                          <td
                            key={`${index}_${Math.random().toString(36).substr(4)}`}
                            data-id={String(row[rowKey])}
                          >
                            <Component {...col.element.props} />
                          </td>
                        );
                      }
                      return (
                        <td key={`${row[col.key]}_${index}_${Math.random().toString(36).substr(4)}`}>
                          { typeof col.format === "function" ? col.format(row, col.key) : row[col.key] }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          )
        }
      </tbody>
    </table>
  )
};

export default Table;
