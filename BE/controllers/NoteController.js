import Notes from '../models/NoteModel.js';

async function getNotes(req, res) {
    try{
        const result = await Notes.findAll();
        res.status(200).json({
            notes: result,
            success: true,
            message: "Notes fetched successfully"
        });
    }catch(err){
        console.log(err);
    }
}

async function addNotes(req, res){
    try{
        const note = await Notes.create(req.body);
        res.status(201).json({
            note: note,
            success: true,
            message: "Note added successfully"
        });
    }catch(err){
        console.log(err);
    }
}

async function updateNotes(req, res){
    try{
        const note = await Notes.update(req.body, {
            where: {
                id: req.params.id
            },
            // returning: true // jika  menggunakan postgres
        });
        res.status(200).json({
            note: note,
            success: true,
            message: "Note updated successfully"
        });
    }catch(err){
        console.log(err);
    }
}

async function deleteNotes(req, res){
    try{
        const note = await Notes.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            note: note,
            success: true,
            message: "Note deleted successfully"
        });
    }catch(err){
        console.log(err);
    }
}

export {getNotes, addNotes, updateNotes, deleteNotes};
