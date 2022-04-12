function getAllProduct() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/products',
        success: function (products) {
            let content = '';
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td>${products[i].category == null ? '' : products[i].category.name}</td>
        <td><button class="btn btn-primary" type="button" data-toggle="modal" data-target="#create-product" 
        onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-product" 
        onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);
        }
    })
}

function showCreateProduct() {
    let title = 'Create Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createNewProduct()"
                        aria-label="Close" class="close" data-dismiss="modal">Create
                </button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    let name = $('#name').val(null);
    let price = $('#price').val(null);
    let description = $('#description').val(null);
    let category = $('#category').val(null);

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        success: function (categories) {
            let content = `<option>Chose category</option>`;
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let category = $('#category').val();
    let product = {
        name: name,
        price: price,
        description: description,
        category : {
            id: category
        }
    }
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products`,
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('Create successfully')
        },
        error: function () {
            showErrorMessage('Create failed')
        }
    })
}

function showDeleteProduct(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Delete</button>`;
    $('#footer-delete').html(footer);
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getAllProduct();
            showSuccessMessage('Delete successfully');
        },
        error: function () {
            showErrorMessage('Delete failed')
        }
    })
}

function showEditProduct(id) {
    let title = 'Edit Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Edit</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success: function (product) {
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#category').val(product.category.id);
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/categories`,
                success: function (categories) {
                    // let content = `<option>Chose category</option>`;
                    // for (let category of categories) {
                    //     content += `<option value="${category.id}">${category.name}</option>`
                    // }
                    let content = "";
                    for (let i = 0; i < categories.length; i++) {
                        if (product.category.id == categories[i].id) {
                            content += `<option value="${categories[i].id}" selected>${categories[i].name}</option>`
                        } else {
                            content += `<option value="${categories[i].id}">${categories[i].name}</option>`
                        }
                    }
                    $('#category').html(content);
                }
            })
        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let category = $('#category').val();
    let product = {
        name: name,
        price: price,
        description: description,
        category : {
            id : category
        }
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/products/${id}`,
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (){
            getAllProduct();
            showSuccessMessage('Edit successfully');
        },
        error: function (){
            showErrorMessage('Edit failed');
        }
    })
}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}


function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}

$(document).ready(function () {
    getAllProduct();
})

