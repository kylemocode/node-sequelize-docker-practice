const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/db');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// db sync 之前做關聯
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) // 當 user 被刪, product 也會被刪
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// many to many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
// 不一定要寫雙向，但寫了比較清楚

// 依照 model, create table if not exists
// 已經存在就不重建 不存在就新建
sequelize.sync() // production 不太會 force
	.then((result) => {
		return User.findByPk(1);
	})
	.then(user => {
		if (!user) {
			return User.create({ name: 'Kyle', email: 'kylemo@test.com' });
		}
		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(() => {
		app.listen(8000, () => {
			console.log('listening on 8000')
		});
	})
	.catch(err => {
		console.log(err);
	})



