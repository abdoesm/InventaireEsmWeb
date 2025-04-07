interface HeaderContainerProps {
    children: React.ReactNode;
  }
  
  const HeaderContainer = ({ children }: HeaderContainerProps) => {
    return (
      <div className="d-flex justify-content-between align-items-center mb-4">
        {children}
      </div>
    );
  };
  
  export default HeaderContainer;
  