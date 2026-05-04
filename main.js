const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const avatar = document.getElementById("avatar");
const tbody = document.querySelector("tbody");
const registerForm = document.getElementById("register");
const selectAvatar = document.getElementById("selectAvatar")
const search = document.getElementById("search");
let users = JSON.parse(localStorage.getItem("users")) || [];
let id = JSON.parse(localStorage.getItem("id")) || 0;

render()


registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = avatar.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const base64 = reader.result;

        users.push({
            id: ++id,
            fullName: fullName.value,
            email: email.value,
            password: password.value,
            avatar: base64,
        });

        localStorage.setItem("users", JSON.stringify(users));

        registerForm.reset();
        selectAvatar.style.backgroundImage = "";
        avatar.value = "";
        render();
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});
selectAvatar.addEventListener("click", () => avatar.click())

avatar.addEventListener("input", () => {
    const url = URL.createObjectURL(avatar.files[0])
    selectAvatar.style.backgroundImage = `url("${url}")`
}
)
function render() {
    


    tbody.innerHTML = "";

    const searchValue = search.value.toLowerCase();

    const filteredUsers = users.filter(usr =>
        usr.fullName.toLowerCase().includes(searchValue) ||
        usr.email.toLowerCase().includes(searchValue)
    );

    filteredUsers.forEach(usr => {
        tbody.innerHTML +=`
        <tr class="hover:bg-white/10 transition rounded-xl">
                        <td class="py-3">${usr.id}</td>
                        <td> <img src="${usr.avatar}" alt="${usr.fullName}" class="w-10 h-10 rounded-full"></td>
                        <td>${usr.fullName}</td>
                        <td>${usr.email}</td>
                        <td class="text-gray-400 relative group">
                         <span class="blur-sm group-hover:blur-none transition">
                                          ${usr.password}
                                            </span>
                                                </td>

                        <td class="flex gap-2 py-2">
                            <button class="bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded-lg text-sm backdrop-blur " onclick="deleteUser(${usr.id})">
                                Delete
                            </button>

                            <button
                                class="bg-yellow-400/80 hover:bg-yellow-500 px-3 py-1 rounded-lg text-sm text-black backdrop-blur" onclick="editUser(${usr.id})">
                                Edit
                            </button>
                        </td>
                    </tr>
        `;
    });
}



function deleteUser(usrID) {
    users = users.filter(usr => usr.id !== usrID);
    localStorage.setItem("users", JSON.stringify(users));
    render()
}






function editUser(id) {
    const user = users.find(usr => usr.id === id);

    const newName = prompt("Adı dəyiş:", user.fullName);
    const newEmail = prompt("Email dəyiş:", user.email);
    const newPassword = prompt("Password dəyiş:", user.password);

    users = users.map(usr =>
        usr.id === id
            ? {
                  ...usr,
                  fullName: newName || usr.fullName,
                  email: newEmail || usr.email,
                  password: newPassword || usr.password,
              }
            : usr
    );

    localStorage.setItem("users", JSON.stringify(users));
    render();
}

search.addEventListener("input", render);