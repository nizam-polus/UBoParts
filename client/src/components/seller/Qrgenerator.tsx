import React from 'react'
import { useBarcode } from 'next-barcode';

const Qrgenerator =  React.forwardRef(({ qrValue }: any, ref: any) => {

  const { inputRef } = useBarcode({
    value: qrValue,
    options: {
      displayValue: true,
      background: '#FFCF00',
      format: "EAN13",
      flat: true
    }
  });

  return (
    <div ref={ref} style={{ paddingTop: "10px" }}>
      <img ref={inputRef} style={{maxWidth: "100%", height: "120px"}} />
    </div>
  )
})

export default Qrgenerator