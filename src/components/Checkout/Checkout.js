import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import useUser from "../../hooks/useUser";
import { setOrder, updateDb } from "../../firebase/index";
import { useHistory } from "react-router";
import "./Checkout.css";
import { Helmet } from "react-helmet";
import CreditCard from "../CreditCard/CreditCard";

export default function Checkout() {
	const { cartTotal, cartClean, cartList } = useCart();
	const { user } = useUser();
	const [name, setName] = useState("");
	const [lastname, setLastame] = useState("");
	const [direction, setDirection] = useState("");
	const [validateCard, setValidateCard] = useState(false);
	const history = useHistory();
	const currentUser = user ? user.email : "";

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateCard === true) {
			setOrder(
				name,
				lastname,
				direction,
				currentUser,
				cartList,
				cartTotal()
			).then((id) => {
				history.push(`/ticket/${id}`);
			});
			updateDb(cartList).catch((err) => console.log(err));
			cartClean();
		}
	};
	const handleCancel = (e) => {
		e.preventDefault();
		history.push("/cart");
	};
	return (
		<>
			<Helmet>
				<title>NAIG | Tu pedido</title>
			</Helmet>
			<div className="checkout">
				<h2 className="checkout__title">Confirmar Compra</h2>
				<label className="checkout__label">
					Email
					<span>{currentUser}</span>
				</label>
				<CreditCard onValidate={setValidateCard} />
				<form onSubmit={handleSubmit}>
					<h4 className="checkout__subtitle">Datos facturación</h4>
					<label className="checkout__label">
						Nombre
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="checkout__input"
							required
						/>
					</label>
					<label className="checkout__label">
						Apellido
						<input
							type="text"
							value={lastname}
							onChange={(e) => setLastame(e.target.value)}
							className="checkout__input"
							required
						/>
					</label>
					<label className="checkout__label">
						Dirección
						<input
							type="text"
							value={direction}
							onChange={(e) => setDirection(e.target.value)}
							className="checkout__input"
							required
						/>
					</label>
					<div className="checkout__buttons">
						<button
							onClick={handleCancel}
							type="button"
							className="checkout__button checkout__button--cancel"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="checkout__button checkout__button--confirm"
						>
							Confirmar
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
