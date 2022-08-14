import dynamic from 'next/dynamic'

const DynamicPlot = dynamic(import('../../components/modeTable'), {
  ssr: false
})

export default DynamicPlot