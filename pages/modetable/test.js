import dynamic from 'next/dynamic'

const DynamicPlot = dynamic(import('../../components/plot'), {
  ssr: false
})

export default DynamicPlot