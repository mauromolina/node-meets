import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const formsEliminar = document.querySelectorAll('.eliminar-comentario');
    if(formsEliminar.length > 0){
        formsEliminar.forEach(form => {
            form.addEventListener('submit', deleteComment);
        });
    }
});

function deleteComment(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Eliminar comentario?',
        text: "Un comentario eliminado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
            const commentId = this.children[0].value;
            const data = {
                commentId,
            }
            axios.post(this.action, data)
            .then(resp => {
                Swal.fire(
                    'Perfecto!',
                    resp.data,
                    'success'
                );
                this.parentElement.parentElement.remove();
            })
            .catch( error => {
                if(error.response.status === 403 || error.response.status === 404 ){
                    Swal.fire(
                        'Error',
                        resp.data,
                        'error'
                    );
                }
            })
        }
      })
      

    
}