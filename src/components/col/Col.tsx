interface ICol {
  flex: string
  className?: string
  children: React.ReactNode
}

const Col = ({ flex, className, children }: ICol): JSX.Element => {
  return (
    <div style={{ flex }} className={className}>
      {children}
    </div>
  )
}

export default Col
