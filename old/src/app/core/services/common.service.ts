import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  ModuleRecord,
  TreeNode,
} from '../../pages/manage-applications/manage-applications.interface';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly http = inject(HttpClient);
  convertImageToBase64(url: string) {
    return this.http
      .get(url, { responseType: 'blob' })
      .toPromise()
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob as Blob);
        });
      });
  }

  convertBase64ToFile(base64Data: string, fileName?: string) {
    const mimeType = this.extractMimeType(base64Data);

    // const data = base64Data.split(',')[1]; // Remove data URI part
    // const byteCharacters = atob(base64Data);
    const data = base64Data.split(',')[1]; // Remove data URI part
    const byteCharacters = atob(data);
    //  const byteCharacters = atob(match[1]);
    // Create an array buffer to store the decoded byte data
    const byteArrays = new Uint8Array(byteCharacters.length);

    // Populate the byte array with the decoded data
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    // Create a Blob with the byte data and the specified MIME type
    const blob = new Blob([byteArrays], { type: mimeType });

    const file = new File([blob], !!fileName ? fileName : 'test.pdf', {
      type: mimeType,
    });

    return !!file ? file : null;
  }

  async convertFileUrlTOFile(fileUrl: string) {
    const response = await fetch(fileUrl);

    // Convert the response to a Blob
    const blob = await response.blob();
    const mimeType = response.headers.get('Content-Type') || 'undefined';
    const url = new URL(fileUrl);

    // Get the last part of the pathname, which is the file name
    const fileName = url.pathname.split('/').pop() || '';
    // Create a new File object from the Blob, providing a filename and MIME type
    const file = new File([blob], fileName, { type: mimeType });

    return file;
  }

  extractMimeType(base64String: string): string {
    // Match the MIME type from the Base64 string using regex
    const matches = base64String.match(/^data:(.+?);base64,/);
    if (matches && matches[1]) {
      return matches[1]; // Return the MIME type (e.g., image/png, application/pdf)
    }
    return ''; // If no MIME type is found, return an empty string
  }

  mapToTreeNode(data: ModuleRecord[]): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>();

    data.forEach(({ id, name, canRead, canWrite, canDelete }) => {
      nodeMap.set(id, {
        title: name,
        key: id.toString(),
        children: [],
        canRead,
        canWrite,
        canDelete,
      });
    });

    const tree: TreeNode[] = [];

    data.forEach(({ id, parentModuleId }) => {
      const node = nodeMap.get(id);
      if (node) {
        node.expanded = data.some(item => item.parentModuleId === id);
        if (parentModuleId !== null) {
          const parent = nodeMap.get(parentModuleId);
          if (parent) {
            parent.children!.push(node);
          }
        } else {
          tree.push(node);
        }
      }
    });

    return tree;
  }
}
