import subprocess
import sys
from pathlib import Path


def create_virtual_env(env_name):

    env_path = Path(env_name)

    subprocess .run([sys .executable, "-m", "venv", str(env_path)])
    print(f"""Virtual environment '{
        env_name}' created at {env_path .absolute()}.""")


def activate_virtual_env(env_name):

    env_path = Path(env_name)

    if sys .platform == "win32":
        activate_script = env_path / "Scripts"/"activate"
        python_executable = env_path / "Scripts"/"python"
    else:
        activate_script = env_path / "bin"/"activate"
        python_executable = env_path / "bin"/"python"

    print(f"Run the following command to activate the virtual environment:")
    print(f"source {activate_script}")

    return python_executable


def install_dependencies(python_executable, requirements_file="requirements.txt"):

    requirements_path = Path(requirements_file)
    if not requirements_path .exists():
        print(f"'{requirements_file}' not found. Skipping dependency installation.")
        return

    print(f"Installing dependencies from '{requirements_file}'...")
    subprocess .run([str(python_executable), "-m", "pip",
                     "install", "-r", str(requirements_path)])
    print("Dependencies installed successfully.")


if __name__ == "__main__":
    env_name = ".venv"
    requirements_file = "requirements.txt"

    create_virtual_env(env_name)

    python_executable = activate_virtual_env(env_name)

    install_dependencies(python_executable, requirements_file)
