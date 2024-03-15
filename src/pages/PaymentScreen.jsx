const PaymentScreen = ({ cart, setCart, render, setRender, userState }) => {
  return (
    <div className=" flex flex-col gap-20">
      <div>PaymentScreen</div>
      <div className="m-auto text-sm flex flex-col gap-6">
        {cart.map((item) => (
          <div key={item.key}>{item.title}</div>
        ))}
      </div>
    </div>
  );
};

export default PaymentScreen;
