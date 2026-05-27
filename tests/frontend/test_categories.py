from selenium.webdriver.common.by import By
import uuid
import time


def test_create_category(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/a[4]').click()
    time.sleep(2)

    category_value = uuid.uuid4().hex[:8]

    driver.find_element(By.CLASS_NAME, "category-input").send_keys(category_value)
    driver.find_element(By.CLASS_NAME, "category-create-button").click()
    driver.refresh()
    time.sleep(2)
    categories = driver.find_elements(By.CLASS_NAME, "category-card")
    category = categories[-1]

    assert category.find_element(By.CLASS_NAME, "category-title").text == category_value

def test_delete_category(driver):
    test_create_category(driver)

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/a[4]').click()
    time.sleep(2)

    categories = driver.find_elements(By.CLASS_NAME, "category-card")
    category = categories[-1]
    name = category.find_element(By.CLASS_NAME, "category-title").text

    category.find_element(By.CLASS_NAME, "category-delete-button").click()
    driver.refresh()
    time.sleep(2)

    categories = driver.find_elements(By.CLASS_NAME, "category-card")
    category = categories[-1]
    assert category.find_element(By.CLASS_NAME, "category-title").text != name

def test_edit_category(driver):
    test_create_category(driver)

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/a[4]').click()
    time.sleep(2)

    category_new_name = uuid.uuid4().hex[:8]

    categories = driver.find_elements(By.CLASS_NAME, "category-card")
    category = categories[-1]

    category.find_element(By.CLASS_NAME, "category-edit-button").click()
    driver.find_element(By.CLASS_NAME, "edit-category-input").clear()
    driver.find_element(By.CLASS_NAME, "edit-category-input").send_keys(category_new_name)
    driver.find_element(By.CLASS_NAME, "edit-category-save").click()
    time.sleep(2)
    
    categories = driver.find_elements(By.CLASS_NAME, "category-card")
    category = categories[-1]
    assert category.find_element(By.CLASS_NAME, "category-title").text == category_new_name
