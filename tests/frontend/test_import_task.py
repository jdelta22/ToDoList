from selenium.webdriver.common.by import By
import time


def test_sidebar_import_tasks_button(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"


    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/button[1]').click()
    time.sleep(2)

    driver.find_element(By.CLASS_NAME, "import-modal-input").send_keys("http://localhost:5173/share/a84f0e20-7020-4e9f-a0e4-ad96215bf8bd")
    driver.find_element(By.CLASS_NAME, "import-confirm-button").click()
    time.sleep(2)

    alert = driver.switch_to.alert
    alert.accept()
    time.sleep(2)

    driver.refresh()
    time.sleep(2)

    tasks = driver.find_elements(By.CLASS_NAME, "task-card")
    task = tasks[0]
    assert task.find_element(By.CLASS_NAME, "task-title").text == "Tarefa Importada"

    delete_button = task.find_element(By.CLASS_NAME, "delete-button")
    delete_button.click()
    time.sleep(2)

    assert "Tarefa Importada" not in driver.page_source
