import React from 'react'
import { useBarcode } from 'next-barcode';

const Qrgenerator = ({ qrValue }: any) => {

  const { inputRef } = useBarcode({
    value: qrValue,
    options: {
      displayValue: true,
      background: '#FFCF00',
    }
  });
  return (
    <div style={{ paddingTop: "10px" }}>
      <img ref={inputRef} />
    </div>
  )
}

export default Qrgenerator