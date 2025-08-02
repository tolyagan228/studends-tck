const getStudents = document.querySelector("[getStudents]");
const studentsField = document.querySelector("[studentsField]");

let studentsData = [];

const inputName = document.querySelector("[surname]");
const inputAge = document.querySelector("[age]");
const inputCourse = document.querySelector("[course]");
const inputSkills = document.querySelector("[skills]");
const inputEmail = document.querySelector("[email]");
const inputRecord = document.querySelector("[record]");

const addStudentBtn = document.querySelector("[addStudent]");

function showStudents() {
  studentsField.innerHTML = "";
  studentsData.forEach((element) => {
    studentsField.innerHTML += `<tr>
          <td>${element.id}</td>
          <td>${element.name}</td>
          <td>${element.age}</td>
          <td>${element.course}</td>
          <td>${element.skills}</td>
          <td>${element.email}</td>
          <td>${element.isEnrolled ? "Так" : "Ні"}</td>
          <td>
            <button edit data-student-id="${element.id}">💚</button>
            <button delete data-student-id="${element.id}">💔</button>
          </td>
        </tr>`;
  });
}

function clearInputFields() {
  inputName.value = "";
  inputAge.value = "";
  inputCourse.value = "";
  inputSkills.value = "";
  inputEmail.value = "";
  inputRecord.checked = false;
}

getStudents.addEventListener("click", () => {
  fetch("./students.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Отримані дані:", data);
      if (data && Array.isArray(data.students)) {
        studentsData = data.students;
        showStudents();
      } else {
        console.error(
          "Очікувався об'єкт з властивістю 'students', що є масивом."
        );
      }
    })
    .catch((error) => console.error("Помилка завантаження студентів:", error));
});

addStudentBtn.addEventListener("click", () => {
  if (
    !inputName.value ||
    !inputAge.value ||
    !inputCourse.value ||
    !inputSkills.value ||
    !inputEmail.value
  ) {
    alert("Будь ласка, заповніть усі поля!");
    return;
  }
  const editingId = addStudentBtn.dataset.editingId;
  if (editingId) {
    const studentIndex = studentsData.findIndex(
      (student) => student.id === parseInt(editingId)
    );
    if (studentIndex !== -1) {
      studentsData[studentIndex] = {
        ...studentsData[studentIndex],
        name: inputName.value,
        age: parseInt(inputAge.value),
        course: inputCourse.value,
        skills: inputSkills.value,
        email: inputEmail.value,
        isEnrolled: inputRecord.checked,
      };
      showStudents();
      addStudentBtn.textContent = "Додати студента";
      delete addStudentBtn.dataset.editingId;
      clearInputFields();
    }
  } else {
    const newStudentId = studentsData.length + 1;

    const newStudent = {
      id: newStudentId,
      name: inputName.value,
      age: parseInt(inputAge.value),
      course: inputCourse.value,
      skills: inputSkills.value,
      email: inputEmail.value,
      isEnrolled: inputRecord.checked,
    };

    studentsData.push(newStudent);
    showStudents();
    clearInputFields();
    console.log("Додано нового студента:", newStudent);
  }
});

studentsField.addEventListener("click", (event) => {
  const target = event.target;

  if (target.hasAttribute("delete")) {
    const studentIdToDelete = parseInt(target.dataset.studentId);
    console.log("Видаляємо студента з ID:", studentIdToDelete);

    studentsData = studentsData.filter(
      (student) => student.id !== studentIdToDelete
    );
    showStudents();
    console.log("Студент видалений (локально). Поточні дані:", studentsData);
  }

  if (target.hasAttribute("edit")) {
    const studentIdToEdit = parseInt(target.dataset.studentId);
    console.log("Редагуємо студента з ID:", studentIdToEdit);

    const studentToEdit = studentsData.find(
      (student) => student.id === studentIdToEdit
    );

    if (studentToEdit) {
      inputName.value = studentToEdit.name;
      inputAge.value = studentToEdit.age;
      inputCourse.value = studentToEdit.course;
      inputSkills.value = studentToEdit.skills;
      inputEmail.value = studentToEdit.email;
      inputRecord.checked = studentToEdit.isEnrolled;

      addStudentBtn.dataset.editingId = studentIdToEdit;
      addStudentBtn.textContent = "Зберегти зміни";
      console.log(
        "Поля заповнено для редагування студента ID:",
        studentIdToEdit
      );
    } else {
      console.warn(
        "Студента для редагування з ID " + studentIdToEdit + " не знайдено."
      );
    }
  }
});
