// import express
const express = require('express');

// import prisma client
const prisma = require('../prisma/client');

// import validation result from express-validator
const { validationResult } = require('express-validator');

// import bcrypt
const bcrypt = require('bcryptjs');

// func find users
const findUsers = async (req, res) => {
	try {
		// get all users from database
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
			},
			orderBy: {
				id: 'desc',
			},
		});

		// send response
		res.status(200).send({
			success: true,
			message: 'Get all users successfully',
			data: users,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Internal server error',
		});
	}
};

// func create user
const createUser = async (req, res) => {
	// check validate result
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// if there is an error, return error to user
		return res.status(422).json({
			success: false,
			message: 'Validation error',
			error: errors.array(),
		});
	}

	// hash password
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword,
			},
		});

		res.status(201).send({
			success: true,
			message: 'User created successfully',
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Internal server error',
		});
	}
};

const findUserById = async (req, res) => {
	// get ID from params
	const { id } = req.params;

	try {
		// get user by ID
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		// send response
		res.status(200).send({
			success: true,
			message: `Get user by ID : ${id}`,
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Internal server error',
		});
	}
};

// func update user
const updateUser = async (req, res) => {
	// get ID from params
	const { id } = req.params;

	// check validate result
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// if there is an error, return error to user
		return res.status(422).json({
			success: false,
			message: 'Validation error',
			error: errors.array(),
		});
	}

	// hash password
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	try {
		// update user
		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword,
			},
		});

		// send response
		res.status(200).send({
			success: true,
			message: 'User updated successfully',
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Internal server error',
		});
	}
};

// func delete user
const deleteUser = async (req, res) => {
	// get ID from params
	const { id } = req.params;

	try {
		// delete user
		await prisma.user.delete({
			where: {
				id: Number(id),
			},
		});

		// send response
		res.status(200).send({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Internal server error',
		});
	}
};

module.exports = {
	findUsers,
	createUser,
	findUserById,
	updateUser,
	deleteUser,
};
