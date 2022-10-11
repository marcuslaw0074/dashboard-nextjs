import dynamic from 'next/dynamic'

const DynamicPlot = dynamic(import('../../components/heatmap'), {
  ssr: false
})

export default DynamicPlot