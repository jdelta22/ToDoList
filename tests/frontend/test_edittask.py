from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import uuid
import time


def test_edit_task(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    titulo = str(uuid.uuid4())[:8]
    description = str(uuid.uuid4())[:8]

    driver.find_element(By.CLASS_NAME, "task-input").send_keys(titulo)
    driver.find_element(By.CLASS_NAME, "task-textarea").send_keys(description)
    driver.find_element(By.CLASS_NAME, "task-button").click()

    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element(
            (By.TAG_NAME, "body"),
            titulo
        )
    )
    
    assert titulo in driver.page_source

    tasks = driver.find_elements(By.CLASS_NAME, "task-card")

    first_task = tasks[0]

    edit_button = first_task.find_element(By.CLASS_NAME, "edit-button")
    edit_button.click()

    time.sleep(2)

    new_title = str(uuid.uuid4())[:8]
    new_description = str(uuid.uuid4())[:8]

    title_input = driver.find_element(By.CLASS_NAME, "modal-input").send_keys(new_title)
    description_input = driver.find_element(By.CLASS_NAME, "modal-textarea").send_keys(new_description)
    save_button = driver.find_element(By.CLASS_NAME, "save-button").click()

    time.sleep(2)

    assert titulo+new_title in driver.page_source
    assert description+new_description in driver.page_source


    first_task = tasks[0]

    delete_button = first_task.find_element(By.CLASS_NAME, "delete-button")
    delete_button.click()

    time.sleep(2)
    assert titulo+new_title not in driver.page_source
    assert description+new_description not in driver.page_source