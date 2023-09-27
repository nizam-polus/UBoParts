import React from 'react'
import { useBarcode } from 'next-barcode';

const Qrgenerator =  React.forwardRef(({ qrValue }: any, ref: any) => {

  const { inputRef } = useBarcode({
    value: qrValue,
    options: {
      displayValue: true,
      background: '#FFCF00',
    }
  });
  return (
    <div ref={ref} style={{ paddingTop: "10px" }}>
      <img ref={inputRef} />
    </div>
  )
})

export default Qrgenerator