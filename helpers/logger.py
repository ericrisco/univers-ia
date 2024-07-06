import logging
import os
from logging.handlers import TimedRotatingFileHandler

def setup_logger():
    class ContextFilter(logging.Filter):
        def filter(self, record):
            record.Severity = logging.getLevelName(record.levelno)
            record.SourceClassName = record.filename
            trace_field = {
                "trace.id": f"{record.process}{record.thread}"
            }
            record.__dict__.update(trace_field)
            return True
        
    log_directory = "logs"
    log_filename = f"univers.log"
    
    if not os.path.exists(log_directory):
        os.makedirs(log_directory)

    root_logger = logging.getLogger() 
    root_logger.setLevel(logging.DEBUG)
    
    fastapi_logger = logging.getLogger("fastapi")
    fastapi_logger.setLevel(logging.WARNING)
    
    urllib3_logger = logging.getLogger("urllib3")
    urllib3_logger.setLevel(logging.WARNING)
    
    httpx_logger = logging.getLogger("httpx")
    httpx_logger.setLevel(logging.WARNING)
    
    openai_logger = logging.getLogger("openai")
    openai_logger.setLevel(logging.WARNING)
    
    httpcore_logger = logging.getLogger("httpcore")
    httpcore_logger.setLevel(logging.WARNING)    

    multipart_logger = logging.getLogger("multipart.multipart")
    multipart_logger.setLevel(logging.WARNING)

    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')  

    logging.basicConfig(format='%(asctime)s - %(levelname)s - %(name)s - %(message)s', handlers=[logging.StreamHandler()])

    file_handler = TimedRotatingFileHandler(f"{log_directory}/{log_filename}", when="midnight", interval=1, backupCount=7)
    
    file_handler.setFormatter(formatter)
    file_handler.suffix = "%Y-%m-%d"
    
    root_logger.addFilter(ContextFilter())
    root_logger.addHandler(file_handler)  
    
    return root_logger