const Tought = require('../models/Tought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ToughtsController {
    static async showToughts (req, res) {
        let search = '';
        let order = 'DESC';

        if(req.query.search && req.query.search.trim() != '') {
            search = req.query.search;
        }
        
        if(req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
                include: User,
                where: {
                    title: { [Op.like]: `%${search}%`},
                },
                order: [['createdAt', order]]
            })

        //Une o pensamento e seu usuário no mesmo array
        const toughtsRight = toughtsData.map((result) => result.get({ plain: true }));

        let toughtsQty = toughtsRight.length;
        if(toughtsQty === 0) {
            toughtsQty = false;
        }

        res.render('toughts/home', { toughtsRight, search, toughtsQty });
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;
        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Tought,
            plain: true
        });

        //check if user exists
        if(!user) {
            res.redirect('/login');
        }

        //Trasnforma os dados resgatados em um array apenas com os pensamentos
        const toughts = user.Toughts.map((result) => result.dataValues);
        
        let emptyToughts = false;
        if(toughts.length === 0) {
            emptyToughts = true;
        }

        res.render('toughts/dashboard', { toughts, emptyToughts });
    }

    static createTought(req, res) {
        res.render('toughts/create');
    }

    static async createToughtPost(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought);
            req.flash('message', 'Pensamento criado com sucesso!');

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(error) {
            console.log(`Ocorreu um erro ao salvar o pensamento, erro: ${error}`);
        }
    }

    static async removeTought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid;

        try {
            await Tought.destroy({where: {id: id, UserId: UserId}});
            req.flash('message', 'Pensamento removido com sucesso!');

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(error) {
            console.log(`Ocorreu um erro ao deletar o pensamento, erro: ${error}`);
        }
    }

    static async updateTought(req, res) {
        const id = req.params.id;
        const tought = await Tought.findOne({where: {id: id}, raw: true});

        res.render('toughts/edit', { tought });
    }

    static async updateToughtPost(req, res) {
        const id = req.body.id;

        const tought = {
            title: req.body.title,
        }

        try {
            await Tought.update(tought, {where: {id: id}});
            req.flash('message', 'Pensamento atualizado com sucesso!');

            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })
        } catch(error) {
            console.log(`Erro ao atualizar pensamento, erro: ${error}`);
        }
    }
}